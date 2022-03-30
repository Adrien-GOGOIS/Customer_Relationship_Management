const mongoose = require("mongoose");
const express = require("express");
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

// Import router d'un autre fichier JS
const register = require("./routers/register.js");
const login = require("./routers/login.js");

// SECTIONS DANS L'API
app.use("/register", register);
app.use("/login", login);

app.get("*", (_req, res) => {
  res.status(404).send("Error 404, cette page n'existe pas");
});

app.listen(8000, () => {
  console.log("LISTEN ON PORT 8000");
});
