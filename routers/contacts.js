const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const router = express.Router();

// Models
const Contact = require("../models/contactModel");

// Code serveur
const secret = process.env.SERVER_CODE;

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// Vérification du token
function isAdmin(req, res, next) {
  try {
    jwt.verify(req.cookies.jwtCookie, secret);
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  res.send("Requête acceptée");
  next();
}

// Dotenv
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

// **** ROUTES **** //

// Récupération contacts
router.get("/", isAdmin, (req, res) => {});

module.exports = router;
