const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

// Models
const Request = require("../models/requestModel");

// Code serveur
const secret = process.env.SERVER_CODE;

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

async function addRequest(req, res, next) {
  try {
    const decoded = jwt.verify(req.cookies.jwtCookie, secret);
    await Request.create({
      url: "http://localhost:8000" + req.originalUrl,
      verb: req.method,
      date: Date.now(),
      userId: decoded.id,
    });
  } catch (err) {
    console.log(err);
    res.staus(400).json({
      message: "An error happened to add request marker",
    });
  }
  next();
}

// Export fonction
module.exports = addRequest;
