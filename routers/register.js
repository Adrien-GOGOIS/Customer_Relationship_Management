const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const app = express();
const router = express.Router();

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

// REGISTER
router.post("/", async (req, res) => {
  // Guard : password doit contenir 6 caractères et au moins 1 chiffre
  if (req.body.password.length < 6 || !/\d/.test(req.body.password)) {
    return res.status(400).json({
      message: "Invalid data",
    });
  }

  // Hashage password
  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  // Création user
  try {
    await User.create({
      email: req.body.email,
      password: hashedPassword,
    });
  } catch (err) {
    return res.status(400).json({
      message: "This account already exists",
    });
  }

  // Success
  res.status(201).json({
    message: `User ${req.body.email} created`,
  });
});

module.exports = router;
