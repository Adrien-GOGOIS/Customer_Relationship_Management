const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const router = express.Router();

// Code serveur
const secret = process.env.SERVER_CODE;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Dotenv
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

// Models
const User = require("../models/userModel");
const Contact = require("../models/contactModel");

// ***** ROUTES ***** //

// LOGIN
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  // Vérification
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  // Hash === password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  // Token
  const token = jwt.sign({ id: user._id }, secret);

  res.cookie("jwt", token, { httpOnly: true, secure: false });

  // Success
  res.json({
    message: "Cookie send",
  });
});

module.exports = router;
