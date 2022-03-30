const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const router = express.Router();

// Models
const Contact = require("../models/contactModel");
const User = require("../models/userModel");

// Code serveur
const secret = process.env.SERVER_CODE;

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// Vérification du token
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
  console.log(userObject.isAdmin);
  if (userObject.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

// Dotenv
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

// **** ROUTES **** //
router.get("/admin", isAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router;

module.exports = router;
