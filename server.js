const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

// Code serveur
const secret = "5aJif0OZjepB63NRwyNSkk0czzttHKjXNQbEImrW";

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

// REGISTER
app.post("/register", async (req, res) => {
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

// LOGIN
app.post("/login", async (req, res) => {
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

app.get("/", (req, res) => {});

app.listen(8000, () => {
  console.log("LISTEN ON PORT 8000");
});
