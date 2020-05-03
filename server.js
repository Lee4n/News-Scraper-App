const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

let PORT = process.env.PORT || 8000;

const app = express();

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

app.use(express.static(process.cwd() + "/public"));

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/scraper_news";
  mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to Mongoose!");
});

const routes = require("./controller/controller.js");
app.use("/", routes);

app.listen(PORT, function () {
  console.log(`App running on http://localhost:${PORT}`);
});