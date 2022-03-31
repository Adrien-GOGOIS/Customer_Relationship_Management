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

// GET main
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find();

    if (requests.length === 0) {
      return res.send("No user online in last hour");
    }
    res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "An error happened",
    });
  }
});

// GET Stats
router.get("/stats", async (req, res) => {
  const requests = await Request.find();
  const verbData = await Request.aggregate([{ $sortByCount: "$verb" }]);
  const urlData = await Request.aggregate([{ $sortByCount: "$url" }]);
  res.json({
    nbRequests: requests.length,
    mostUsedURL: urlData[0],
    mostUsedVerb: verbData[0],
  });
});

module.exports = router;
