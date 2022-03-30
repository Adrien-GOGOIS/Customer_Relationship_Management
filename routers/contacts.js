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

// Dotenv
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

// **** ROUTES **** //

// Récupération des contacts d'un user
router.get("/:userId", isAdmin, async (req, res) => {
  const userContacts = await Contact.find({ userId: req.params.userId }).select(
    "-__v"
  );
  res.json({
    data: userContacts,
    nb: userContacts.length,
  });
});

// Création contacts
router.post("/:userId", isAdmin, async (req, res) => {
  const user = await User.findById(req.params.userId);

  try {
    const contact = await Contact.create({
      userId: user._id,
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      category: req.body.category,
    });

    res.status(201).json({
      message: "Contact ajouté",
      description: contact,
    });
  } catch (err) {
    res.status(400).json({
      message: "An error happened",
    });
  }
});

// Modification d'un contact
router.put("/:userId/:contactId", isAdmin, async (req, res) => {
  try {
    const contact = await Contact.findOne(
      { _id: req.params.contactId },
      { userId: req.params.userId }
    );
    const updatedContact = await Contact.findByIdAndUpdate(
      contact._id,
      req.body
    );
    res.json({
      message: "Contact updated",
      description: updatedContact,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: "An error happened",
    });
  }
});

module.exports = router;
