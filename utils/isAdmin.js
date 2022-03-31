const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

// Models
const User = require("../models/userModel.js");

// Code serveur
const secret = process.env.SERVER_CODE;

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

async function isAdmin(req, res, next) {
  // On vérifie qu'il y a bien un token valide
  try {
    jwt.verify(req.cookies.jwtCookie, secret);
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // On vérifie que ce token contient bien l'ID d'un utilisateur admin
  const decoded = jwt.verify(req.cookies.jwtCookie, secret);

  const user = await User.findById(decoded.id);
  const userObject = user.toObject();

  if (userObject.isAdmin) {
    // Ajout d'une "trace" à chaque requête d'un user
    user.last_request = Date.now();
    next();
  } else {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

module.exports = isAdmin;
