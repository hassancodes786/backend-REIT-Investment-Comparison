const mongoose = require("mongoose");

// Expose a simple guard for controllers
const isReady = () => mongoose.connection.readyState === 1;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes("<db_password>")) {
    console.error("❌ MONGO_URI is missing or still has the <db_password> placeholder.");
    console.error("   → Open backend/.env and replace <db_password> with your real Atlas password.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.error("\n⚠️  Atlas Checklist:");
    console.error("   1. Correct password in backend/.env");
    console.error("   2. Your IP is whitelisted in Atlas → Network Access → 0.0.0.0/0");
    console.error("   3. Database name is correct in the URI");
    process.exit(1);   // stop the server — no point running without a DB
  }
};

module.exports = connectDB;
module.exports.isReady = isReady;