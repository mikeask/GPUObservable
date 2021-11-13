const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const twitter = require("./src/services/TwitterService");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan("dev"));

require("./src/controllers/GPU/PriceController")(app);

app.listen(PORT, () => {
  console.log("server running at port " + PORT);
});
