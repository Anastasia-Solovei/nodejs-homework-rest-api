const mongoose = require("mongoose");
require("dotenv").config();

let uri;

if (process.env.NODE_ENV == "test") {
  uri = process.env.DB_HOST_TEST;
} else {
  uri = process.env.DB_HOST;
}

const db = mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

if (process.env.NODE_ENV == "test") {
  mongoose.connection.on("connected", () => {
    console.log("Database connection successful");
  });

  mongoose.connection.on("error", (err) => {
    console.log(`Database connection failed. Error ${err.message}`);
  });
}

// disconnected

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Database connection closed");
  process.exit();
});

module.exports = db;
