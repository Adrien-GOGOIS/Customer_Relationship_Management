const mongoose = require("mongoose");
const express = require("express");
const app = express();

app.use(express.json());

const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

// Connection DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to Database");
  });

app.get("/", (req, res) => {});

app.listen(8000, () => {
  console.log("LISTEN ON PORT 8000");
});
