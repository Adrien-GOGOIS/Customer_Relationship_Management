const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

// Code serveur
const secret = process.env.SERVER_CODE;

// Models
const User = require("../models/userModel");

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

async function isLogged(req, res, next) {
  try {
    jwt.verify(req.cookies.jwtCookie, secret);
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // Ajout d'une "trace" à chaque requête d'un user
  const decoded = jwt.verify(req.cookies.jwtCookie, secret);
  await User.findByIdAndUpdate(decoded.id, {
    last_request: Date.now(),
  });

  next();
}

// Export fonction
module.exports = isLogged;
