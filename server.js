require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/reits",       require("./routes/reitRoutes"));
app.use("/api/invits",      require("./routes/invitRoutes"));
app.use("/api/properties",  require("./routes/propertyRoutes"));
app.use("/api/investments", require("./routes/investmentRoutes"));
app.use("/api/auth",        require("./routes/authRoutes"));
app.use("/api/market",      require("./routes/marketRoutes"));

app.get("/", (_req, res) =>
  res.json({ success: true, message: "REIT & InvIT API is running" })
);

app.use((_req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

app.listen(PORT, () => console.log(`Server → http://localhost:${PORT}`));