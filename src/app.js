const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const app = express();

// middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// route
app.get("/hello", (req, res, next) => {
  res.status(200).send({
    string: "Hello from Kei",
    compressionTest: "ABC HELLLO".repeat(1000),
  });
});
// error
module.exports = app;
