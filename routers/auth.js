const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");

// Code serveur
const secret = process.env.SERVER_CODE;

// models
const User = require("../models/userModel");

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

router.get("/reset", async (req, res) => {
  res.sendFile(path.join(__dirname, "../assets/resetPasswordForm.html"));
});

router.post("/reset", async (req, res) => {
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
    await User.findOneAndUpdate({
      email: req.body.email,
      password: hashedPassword,
    });
  } catch (err) {
    return res.status(400).json({
      message: "An error happened",
    });
  }

  // Success
  res.status(201).json({
    message: `User ${req.body.email} have changed his password`,
  });
});

module.exports = router;
