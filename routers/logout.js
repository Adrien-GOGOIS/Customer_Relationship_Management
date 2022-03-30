const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const router = express.Router();

// Dotenv
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

// Code serveur
const secret = process.env.SERVER_CODE;

// Middlewares
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
  next();
}

// ***** ROUTES ***** //

// LOGOUT
router.get("/", isAdmin, (req, res) => {
  res.clearCookie("jwtCookie", { path: "/" }).status(200).json({
    message: "Logout !",
  });
});

module.exports = router;
