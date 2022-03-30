const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  name: String,
  email: String,
  description: String,
  category: String,
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
