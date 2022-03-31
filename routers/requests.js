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
  const data = await Request.aggregate([
    {
      $match: { verb: "POST" },
    },
  ]);
  console.log(data);
  //   res.json({
  //     message: "Welcome on stats route",
  //     nbRequests: requests.length,
  //     mostUsedURL: "",
  //     mostUsedVerb: "",
  //   });

  res.json({
    data,
  });
});

module.exports = router;
