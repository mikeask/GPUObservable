const mongoose = require("mongoose");

const db_host = process.env.DB_HOST || "cluster0.m49ob.mongodb.net";
const db_port = process.env.DB_PORT || "27017";
const db_user = process.env.DB_USER || "mikeask_user";
const db_pwd = process.env.DB_PWD || "92235925";
const db_name = process.env.DB_NAME || "gpu-observer";

mongoose.connect(
  // "mongodb+srv://mikeask_user:92235925@cluster0.m49ob.mongodb.net/gpu-observer?authSource=admin",
  `mongodb+srv://${db_user}:${db_pwd}@${db_host}/${db_name}?authSource=admin`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify", false);

module.exports = mongoose;
