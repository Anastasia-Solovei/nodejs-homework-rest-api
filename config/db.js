const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.DB_HOST;

const db = mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Database connection successful");
});

mongoose.connection.on("error", (err) => {
  console.log(`Database connection failed. Error ${err.message}`);
});

// disconnected

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Database connection closed");
  process.exit();
});

module.exports = db;
