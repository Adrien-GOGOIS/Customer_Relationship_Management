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

// Dotenv
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

// **** ROUTES **** //
router.get("/admin", isAdmin, async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

router.delete("/admin/:userId", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    await Contact.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({
      message: "User and his contacts have been delete",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "An error happened",
    });
  }
});

router.get("/online", isAdmin, async (req, res) => {
  const lastHours = new Date();
  lastHours.setHours(lastHours.getHours() - 1);

  const users = await User.find({
    last_request: { $lte: new Date(), $gte: lastHours },
  });
  res.status(200).json(users);
});

module.exports = router;
