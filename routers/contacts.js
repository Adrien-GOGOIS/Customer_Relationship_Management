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

// Dotenv
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

// **** ROUTES **** //

// Récupération des contacts d'un user
router.get("/:userId", isLogged, async (req, res) => {
  const userContacts = await Contact.find({ userId: req.params.userId }).select(
    "-__v"
  );
  res.status(200).json({
    data: userContacts,
    nb: userContacts.length,
  });
});

// Création contacts
router.post("/:userId", isLogged, async (req, res) => {
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
router.put("/:userId/:contactId", isLogged, async (req, res) => {
  try {
    const contact = await Contact.findOne(
      { _id: req.params.contactId },
      { userId: req.params.userId }
    );
    const updatedContact = await Contact.findByIdAndUpdate(
      contact._id,
      req.body
    );
    res.status(201).json({
      message: "Contact updated",
      description: updatedContact,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "An error happened",
    });
  }
});

// Suppression d'un contact
router.delete("/:userId/:contactId", isLogged, async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete(
      { _id: req.params.contactId },
      { userId: req.params.userId }
    );
    res.status(200).json({
      message: "Contact deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "An error happened",
    });
  }
});

module.exports = router;
