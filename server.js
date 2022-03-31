const mongoose = require("mongoose");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser");

// Models
const User = require("./models/userModel.js");

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
const contacts = require("./routers/contacts.js");
const logout = require("./routers/logout.js");
const users = require("./routers/users.js");

// SECTIONS DANS L'API
app.use("/register", register);
app.use("/login", login);
app.use("/contacts", contacts);
app.use("/logout", logout);
app.use("/users", users);

app.get("*", (_req, res) => {
  res.status(404).send("Error 404, cette page n'existe pas");
});

app.listen(8000, () => {
  console.log("LISTEN ON PORT 8000");
});
