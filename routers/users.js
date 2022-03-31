const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const router = express.Router();

// Models
const Contact = require("../models/contactModel");
const User = require("../models/userModel");
const Request = require("../models/requestModel");

// Code serveur
const secret = process.env.SERVER_CODE;

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

const addRequest = require("../assets/addRequest");
const isAdmin = require("../assets/isAdmin.js");

// Dotenv
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

// **** ROUTES **** //
router.get("/admin", isAdmin, addRequest, async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// L'admin peut supprimer un user
router.delete("/admin/:userId", isAdmin, addRequest, async (req, res) => {
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

// Récupère les utilisateurs connectés il y a moins d'une heure :
router.get("/online", isAdmin, addRequest, async (req, res) => {
  const lastHours = new Date();
  lastHours.setHours(lastHours.getHours() - 1);

  const users = await User.find({
    last_request: { $lte: new Date(), $gte: lastHours },
  });
  res.status(200).json(users);
});

module.exports = router;
