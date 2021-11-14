const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("./src/services/TwitterService");
var cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const PORT = process.env.PORT || 4000;

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST");
  app.use(cors());
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan("dev"));

require("./src/controllers/GPU/PriceController")(app);

app.listen(PORT, () => {
  console.log("server running at port " + PORT);
});
