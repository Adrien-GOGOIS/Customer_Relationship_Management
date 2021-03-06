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

const addRequest = require("../utils/addRequest");
const isLogged = require("../utils/isLogged");

// Dotenv
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

// **** ROUTES **** //

// Récupération des contacts d'un user
router.get("/:userId", isLogged, addRequest, async (req, res) => {
  const userContacts = await Contact.find({ userId: req.params.userId }).select(
    "-__v"
  );
  res.status(200).json({
    data: userContacts,
    nb: userContacts.length,
  });
});

// Création contacts
router.post("/:userId", isLogged, addRequest, async (req, res) => {
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
router.put("/:userId/:contactId", isLogged, addRequest, async (req, res) => {
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
router.delete("/:userId/:contactId", isLogged, addRequest, async (req, res) => {
  try {
    await Contact.findOneAndDelete(
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

// Export route
module.exports = router;
