const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const axios = require("axios");
const cheerio = require("cheerio");

let PORT = process.env.PORT || 8000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/scraped_news", { useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to Mongoose!");
});

// Routes

app.listen(PORT, function() {
    console.log(`App running on http://localhost:${PORT}`);
  });