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
app.use(helmet());
app.use(compression());
// db
require("./dbs/init-mongo");
checkOverload();
// route
app.use("", routes);
// error
module.exports = app;
