const mongoose = require("mongoose");
const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");

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
const requests = require("./routers/requests.js");

// SECTIONS DANS L'API
app.use("/register", register);
app.use("/login", login);
app.use("/contacts", contacts);
app.use("/logout", logout);
app.use("/users", users);
app.use("/requests", requests);

app.get("*", (_req, res) => {
  res.status(404).send("Error 404, cette page n'existe pas");
});

app.listen(8000, () => {
  console.log("LISTEN ON PORT 8000");
});
