const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Dotenv
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

// Models
const User = require("./models/userModel");
const Contact = require("./models/contactModel");

// Connection DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to Database");
  });

// ***** ROUTES ***** //

app.post("/register", async (req, res) => {
  // Guard : password doit contenir 6 caractères et au moins 1 chiffre
  if (req.body.password.length < 6 || !/\d/.test(req.body.password)) {
    return res.status(400).json({
      message: "Invalid data",
    });
  }

  // 1 - Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  // 2 - Créer un utilisateur
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

  res.status(201).json({
    message: `User ${req.body.email} created`,
  });
});

app.get("/", (req, res) => {});

app.listen(8000, () => {
  console.log("LISTEN ON PORT 8000");
});
