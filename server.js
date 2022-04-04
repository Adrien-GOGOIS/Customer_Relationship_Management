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

// Import router
const register = require("./routers/register.js");
const login = require("./routers/login.js");
const contacts = require("./routers/contacts.js");
const logout = require("./routers/logout.js");
const users = require("./routers/users.js");
const requests = require("./routers/requests.js");
const auth = require("./routers/auth.js");

// Routes de l'API
app.use("/register", register);
app.use("/login", login);
app.use("/contacts", contacts);
app.use("/logout", logout);
app.use("/users", users);
app.use("/requests", requests);
app.use("/auth", auth);

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send("<h1>Welcome</h1>");
});

// Routes inexistantes
app.get("*", (_req, res) => {
  res.status(404).send("Error 404, cette page n'existe pas");
});

// Listen
app.listen(process.env.PORT, () => {
  console.log("LISTEN");
});
