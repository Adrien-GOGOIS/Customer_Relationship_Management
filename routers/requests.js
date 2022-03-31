const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const router = express.Router();

// Models
const Request = require("../models/requestModel");

// Code serveur
const secret = process.env.SERVER_CODE;

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

router.get("/stats", async (req, res) => {
  const stats = await Request.find();
  res.json("Welcome on stats route");
});

module.exports = router;
