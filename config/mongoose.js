const env = require("./environment");

const mongoose = require("mongoose");
mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to MongoDB"));

db.once("open", function () {
  console.log("Connected to database :: MongoDB");
});

module.exports = db;
