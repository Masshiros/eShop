require("./configs/config.env.js");
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const { checkOverload } = require("./helpers/check-connection");
const app = express();
const routes = require("./routes");

// middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" })); // for application/json
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
// db
require("./dbs/init-mongo");
checkOverload();
// route
app.use("", routes);
// 404 middleware
app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});
// error middleware
app.use((error, req, res, next) => {
  return res.status(error.status || 500).json({
    status: "error",
    message: error.message || "Internal Server Error",
    code: error.status,
  });
});
module.exports = app;
