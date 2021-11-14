const mongoose = require("mongoose");

const db_host = process.env.DB_HOST || "localhost";
const db_port = process.env.DB_PORT || "27017";
const db_user = process.env.DB_USER || "mikeask_user";
const db_pwd = process.env.DB_PWD || "123456";
const db_name = process.env.DB_NAME || "gpu-observer";

mongoose.connect(
  `mongodb+srv://${db_user}:${db_pwd}@${db_host}/${db_name}?authSource=admin`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify", false);

module.exports = mongoose;
