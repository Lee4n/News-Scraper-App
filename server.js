const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const axios = require("axios");
const cheerio = require("cheerio");

// const db = require("./models");

let PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Routes

app.listen(PORT, function() {
    console.log(`App running on http://localhost:${PORT}`);
  });