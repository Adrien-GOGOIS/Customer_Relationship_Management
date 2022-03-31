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
  const requests = await Request.find();
  const verbData = await Request.aggregate([{ $sortByCount: "$verb" }]);
  const urlData = await Request.aggregate([{ $sortByCount: "$url" }]);
  res.json({
    message: "Welcome on stats route",
    nbRequests: requests.length,
    mostUsedURL: urlData[0],
    mostUsedVerb: verbData[0],
  });
});

module.exports = router;
