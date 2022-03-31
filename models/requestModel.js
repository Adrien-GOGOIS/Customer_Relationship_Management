const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  url: String,
  verb: String,
  date: Date,
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
