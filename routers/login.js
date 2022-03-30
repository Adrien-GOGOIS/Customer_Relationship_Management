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

// ***** ROUTES ***** //

// LOGIN
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const usr = await User.findOne({ email });
  if (!usr) {
    res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, usr.password);
  if (!isPasswordValid) {
    res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: usr._id }, secret);

  res.cookie("jwtCookie", token, { httpOnly: true, secure: false });

  res.json({
    message: "Auth cookie ready",
  });
});

module.exports = router;
