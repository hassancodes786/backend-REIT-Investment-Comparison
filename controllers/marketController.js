const axios = require("axios");

const NSE_MCP_URL =
  "https://mcp.nseindia.in/cmmkt/mcp";

// ================================
// REIT SYMBOLS
// ================================

const REIT_SYMBOLS = {
  BIRET: "BIRET",
  EMBASSY: "EMBASSY",
  MINDSPACE: "MINDSPACE",
  NXST: "NXST"
};

// ================================
// INVIT SYMBOLS
// ================================
// IRBIT is the ticker currently stored
// in MongoDB, while NSE uses IRBINVIT.

const INVIT_SYMBOLS = {
  INDIGRID: "INDIGRID",
  IRBIT: "IRBINVIT",
  IRBINVIT: "IRBINVIT",
  PGINVIT: "PGINVIT",
  NHIT: "NHIT"
};

// Canonical InvIT symbols for batch requests
const INVIT_MARKET_SYMBOLS = [
  "INDIGRID",
  "IRBINVIT",
  "PGINVIT",
  "NHIT"
];

// ================================
// YAHOO FINANCE SYMBOLS
// ================================

const YAHOO_SYMBOLS = {
  // REIT
  BIRET: "BIRET.NS",
  EMBASSY: "EMBASSY.NS",
  MINDSPACE: "MINDSPACE.NS",
  NXST: "NXST.NS",

  // InvIT
  INDIGRID: "INDIGRID.NS",
  IRBIT: "IRBINVIT.NS",
  IRBINVIT: "IRBINVIT.NS",
  PGINVIT: "PGINVIT.NS",
  NHIT: "NHIT.NS"
};

let MCPClient = null;
let StreamableHTTPClientTransport = null;

let nseClient = null;
let connectingPromise = null;


// ================================
// LOAD MCP CLIENT
// ================================

const loadMCPClient = async () => {
  if (!MCPClient || !StreamableHTTPClientTransport) {
    const mcp =
      await import("@modelcontextprotocol/client");

    MCPClient = mcp.Client;

    StreamableHTTPClientTransport =
      mcp.StreamableHTTPClientTransport;
  }
};


// ================================
// CONNECT TO NSE MCP
// ================================

const getNSEClient = async () => {
  await loadMCPClient();

  if (nseClient) {
    return nseClient;
  }

  if (connectingPromise) {
    return connectingPromise;
  }

  connectingPromise = (async () => {
    const client = new MCPClient({
      name: "reit-investment-comparison",
      version: "1.0.0"
    });

    const transport =
      new StreamableHTTPClientTransport(
        new URL(NSE_MCP_URL)
      );

    console.log("Connecting to NSE MCP...");

    await client.connect(transport);

    console.log("✅ NSE MCP connected");

    nseClient = client;

    return client;
  })();

  try {
    return await connectingPromise;
  } finally {
    connectingPromise = null;
  }
};


// ================================
// RESET NSE CLIENT
// ================================

const resetNSEClient = async () => {
  if (nseClient) {
    try {
      await nseClient.close();
    } catch {}
  }

  nseClient = null;
};


// ================================
// FETCH NSE QUOTE
// ================================

const fetchNSEQuote = async (symbol) => {
  try {
    console.log(
      `Trying NSE MCP: ${symbol}`
    );

    const client = await getNSEClient();

    const result = await client.callTool({
      name: "cm_get_stock_quote",
      arguments: {
        symbol
      }
    });

    if (result?.isError) {
      throw new Error(
        `NSE MCP returned an error for ${symbol}`
      );
    }

    const text =
      result?.content?.find(
        (item) => item.type === "text"
      )?.text;

    if (!text) {
      throw new Error(
        `Empty NSE response for ${symbol}`
      );
    }

    const parsed = JSON.parse(text);

    if (!parsed?.stock) {
      throw new Error(
        `NSE stock data unavailable for ${symbol}`
      );
    }

    console.log(`✅ NSE: ${symbol} @ ₹${parsed.stock.lastTradedPrice}`);

    return parsed;

  } catch (error) {
    console.error(
      `❌ NSE MCP failed for ${symbol}:`,
      error.message
    );

    await resetNSEClient();

    throw error;
  }
};


// ================================
// YAHOO FINANCE FALLBACK
// ================================

const fetchYahooQuote = async (symbol) => {
  const yahooSymbol =
    YAHOO_SYMBOLS[symbol] ||
    `${symbol}.NS`;

  console.log(
    `Trying Yahoo Finance fallback: ${yahooSymbol}`
  );

  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      yahooSymbol
    )}?range=1d&interval=1d`;

  const response =
    await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0"
      }
    });

  const result =
    response.data?.chart?.result?.[0];

  if (!result) {
    throw new Error(
      `Yahoo Finance data unavailable for ${yahooSymbol}`
    );
  }

  const meta = result.meta || {};

  const price =
    meta.regularMarketPrice ??
    meta.chartPreviousClose ??
    null;

  const previousClose =
    meta.previousClose ??
    meta.chartPreviousClose ??
    null;

  let change = null;
  let changePercent = null;

  if (
    price !== null &&
    previousClose !== null
  ) {
    change =
      price - previousClose;

    changePercent =
      previousClose !== 0
        ? (change / previousClose) * 100
        : null;
  }

  const quote =
    result.indicators?.quote?.[0];

  const latestVolume =
    quote?.volume?.[quote.volume.length - 1] ??
    meta.regularMarketVolume ??
    null;

  const dayHigh =
    meta.regularMarketDayHigh ??
    quote?.high?.[quote.high.length - 1] ??
    null;

  const dayLow =
    meta.regularMarketDayLow ??
    quote?.low?.[quote.low.length - 1] ??
    null;

  const data = {
    symbol,
    yahooSymbol,

    price,
    change,
    changePercent,

    previousClose,

    open:
      meta.regularMarketOpen ??
      null,

    high: dayHigh,

    low: dayLow,

    volume: latestVolume,

    value: null,

    fiftyTwoWeekHigh:
      meta.fiftyTwoWeekHigh ??
      null,

    fiftyTwoWeekLow:
      meta.fiftyTwoWeekLow ??
      null,

    change30D: null,

    series: null,

    currency:
      meta.currency ||
      "INR",

    latestTimestamp:
      meta.regularMarketTime
        ? new Date(
            meta.regularMarketTime * 1000
          ).toISOString()
        : null,

    updatedAt:
      new Date().toISOString()
  };

  console.log(`✅ Yahoo: ${symbol} @ ₹${data.price}`);

  return data;
};


// ================================
// FORMAT NSE RESPONSE
// ================================

const formatNSEData = (quote) => {
  const stock =
    quote.stock;

  return {
    source: "NSE MCP",

    symbol:
      stock.symbol,

    nseSymbol:
      stock.symbol,

    name:
      stock.symbol,

    exchange:
      "NSE",

    price:
      stock.lastTradedPrice ?? null,

    change:
      stock.change ?? null,

    changePercent:
      stock.perChange ?? null,

    previousClose:
      stock.preClosePrice ?? null,

    open:
      stock.openPrice ?? null,

    high:
      stock.highPrice ?? null,

    low:
      stock.lowPrice ?? null,

    volume:
      stock.volume ?? null,

    value:
      stock.value ?? null,

    fiftyTwoWeekHigh:
      stock.fiftyTwoWeekHigh ?? null,

    fiftyTwoWeekLow:
      stock.fiftyTwoWeekLow ?? null,

    change30D:
      stock.perChange30d ?? null,

    series:
      stock.series ?? null,

    currency:
      "INR",

    latestTimestamp:
      stock.latestTimestamp ?? null,

    updatedAt:
      quote.updatedAt ?? null
  };
};


// ================================
// SINGLE REIT PRICE
// ================================

const getLiveReitPrice = async (
  req,
  res
) => {
  try {
    const requestedSymbol =
      req.params.symbol?.toUpperCase();

    if (!requestedSymbol) {
      return res.status(400).json({
        success: false,
        message:
          "REIT symbol is required"
      });
    }

    const symbol =
      REIT_SYMBOLS[requestedSymbol] ||
      requestedSymbol;


    // --------------------------------
    // 1. TRY NSE MCP
    // --------------------------------

    try {
      const quote =
        await fetchNSEQuote(symbol);

      const data =
        formatNSEData(quote);

      return res.json({
        success: true,
        source: "NSE MCP",
        delayed: false,
        cached: false,
        data
      });

    } catch (nseError) {

      console.log(
        `⚠️ NSE unavailable for ${symbol}`
      );

      console.log(
        "Using Yahoo Finance fallback..."
      );
    }


    // --------------------------------
    // 2. YAHOO FALLBACK
    // --------------------------------

    try {
      const yahooData =
        await fetchYahooQuote(symbol);

      return res.json({
        success: true,

        source:
          "Yahoo Finance",

        delayed: true,

        cached: false,

        data: {
          ...yahooData,

          exchange: "NSE",

          name:
            symbol,

          nseSymbol:
            symbol
        }
      });

    } catch (yahooError) {

      console.error(
        `❌ Yahoo fallback failed for ${symbol}:`,
        yahooError.message
      );

      return res.status(503).json({
        success: false,

        message:
          "Market data temporarily unavailable",

        symbol,

        errors: {
          nse:
            "NSE MCP market cache unavailable",

          yahoo:
            yahooError.message
        }
      });
    }

  } catch (error) {

    console.error(
      "Market API Error:",
      error.message
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch market data",

      error:
        error.message
    });
  }
};


// ================================
// ALL REIT PRICES
// ================================

const getLiveReitPrices = async (
  req,
  res
) => {
  try {

    const symbols =
      Object.values(
        REIT_SYMBOLS
      );

    console.log(
      "Fetching all REIT market prices..."
    );

    const results = [];

    for (
      const symbol of symbols
    ) {

      try {

        // First NSE
        try {

          const quote =
            await fetchNSEQuote(
              symbol
            );

          const data =
            formatNSEData(
              quote
            );

          results.push({
            ...data,

            success: true,

            delayed: false
          });

          continue;

        } catch {

          console.log(
            `NSE unavailable for ${symbol}, using Yahoo fallback`
          );
        }


        // Then Yahoo
        const yahooData =
          await fetchYahooQuote(
            symbol
          );

        results.push({
          ...yahooData,

          success: true,

          source:
            "Yahoo Finance",

          delayed: true,

          exchange: "NSE",

          name: symbol
        });

      } catch (error) {

        console.error(
          `Market data failed for ${symbol}:`,
          error.message
        );

        results.push({

          symbol,

          success: false,

          error:
            error.message
        });
      }
    }

    return res.json({

      success: true,

      data: results
    });

  } catch (error) {

    console.error(
      "Market batch error:",
      error.message
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch REIT market data",

      error:
        error.message
    });
  }
};


// ==================================================
// INVIT MARKET DATA
// ==================================================


// ================================
// SINGLE INVIT PRICE
// ================================

const getLiveInvitPrice = async (
  req,
  res
) => {
  try {

    const requestedSymbol =
      req.params.symbol?.toUpperCase();

    if (!requestedSymbol) {
      return res.status(400).json({
        success: false,
        message:
          "InvIT symbol is required"
      });
    }

    // Convert MongoDB ticker to NSE ticker
    const symbol =
      INVIT_SYMBOLS[requestedSymbol];

    if (!symbol) {
      return res.status(400).json({
        success: false,

        message:
          `Unsupported InvIT symbol: ${requestedSymbol}`,

        supportedSymbols:
          Object.keys(INVIT_SYMBOLS)
      });
    }


    // --------------------------------
    // 1. TRY NSE MCP
    // --------------------------------

    try {

      console.log(
        `Trying NSE MCP for InvIT: ${symbol}`
      );

      const quote =
        await fetchNSEQuote(symbol);

      const data =
        formatNSEData(quote);

      return res.json({

        success: true,

        source:
          "NSE MCP",

        delayed:
          false,

        cached:
          false,

        assetType:
          "InvIT",

        requestedSymbol,

        data: {
          ...data,

          assetType:
            "InvIT",

          requestedSymbol,

          symbol
        }
      });

    } catch (nseError) {

      console.log(
        `⚠️ NSE unavailable for InvIT ${symbol}`
      );

      console.log(
        "Using Yahoo Finance fallback..."
      );
    }


    // --------------------------------
    // 2. YAHOO FALLBACK
    // --------------------------------

    try {

      const yahooData =
        await fetchYahooQuote(symbol);

      return res.json({

        success: true,

        source:
          "Yahoo Finance",

        delayed:
          true,

        cached:
          false,

        assetType:
          "InvIT",

        requestedSymbol,

        data: {

          ...yahooData,

          assetType:
            "InvIT",

          requestedSymbol,

          exchange:
            "NSE",

          name:
            symbol,

          nseSymbol:
            symbol
        }
      });

    } catch (yahooError) {

      console.error(
        `❌ Yahoo fallback failed for InvIT ${symbol}:`,
        yahooError.message
      );

      return res.status(503).json({

        success: false,

        message:
          "InvIT market data temporarily unavailable",

        requestedSymbol,

        symbol,

        assetType:
          "InvIT",

        errors: {

          nse:
            "NSE MCP market cache unavailable",

          yahoo:
            yahooError.message
        }
      });
    }

  } catch (error) {

    console.error(
      "InvIT Market API Error:",
      error.message
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch InvIT market data",

      error:
        error.message
    });
  }
};


// ================================
// ALL INVIT PRICES
// ================================

const getLiveInvitPrices = async (
  req,
  res
) => {
  try {

    console.log(
      "Fetching all InvIT market prices..."
    );

    const results = [];

    for (
      const symbol of INVIT_MARKET_SYMBOLS
    ) {

      try {

        // --------------------------------
        // FIRST: NSE MCP
        // --------------------------------

        try {

          const quote =
            await fetchNSEQuote(
              symbol
            );

          const data =
            formatNSEData(
              quote
            );

          results.push({

            ...data,

            success:
              true,

            delayed:
              false,

            assetType:
              "InvIT",

            requestedSymbol:
              symbol
          });

          continue;

        } catch {

          console.log(
            `NSE unavailable for InvIT ${symbol}, using Yahoo fallback`
          );
        }


        // --------------------------------
        // SECOND: YAHOO FINANCE
        // --------------------------------

        const yahooData =
          await fetchYahooQuote(
            symbol
          );

        results.push({

          ...yahooData,

          success:
            true,

          source:
            "Yahoo Finance",

          delayed:
            true,

          exchange:
            "NSE",

          name:
            symbol,

          nseSymbol:
            symbol,

          assetType:
            "InvIT",

          requestedSymbol:
            symbol
        });

      } catch (error) {

        console.error(
          `InvIT market data failed for ${symbol}:`,
          error.message
        );

        results.push({

          symbol,

          requestedSymbol:
            symbol,

          assetType:
            "InvIT",

          success:
            false,

          source:
            "Unavailable",

          delayed:
            true,

          error:
            error.message
        });
      }
    }

    return res.json({

      success:
        true,

      count:
        results.length,

      data:
        results
    });

  } catch (error) {

    console.error(
      "InvIT market batch error:",
      error.message
    );

    return res.status(500).json({

      success:
        false,

      message:
        "Failed to fetch InvIT market data",

      error:
        error.message
    });
  }
};


// ================================
// EXPORTS
// ================================

module.exports = {

  // REIT
  getLiveReitPrice,
  getLiveReitPrices,

  // InvIT
  getLiveInvitPrice,
  getLiveInvitPrices
};