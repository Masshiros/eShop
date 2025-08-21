const dotenv = require("dotenv");
dotenv.config();
const env = process.env.NODE_ENV || "development";

const envFileMap = {
  development: ".env.dev",
  production: ".env.pro",
  test: ".env.test",
};
const envFile = envFileMap[env] || ".env.dev";
dotenv.config({ path: envFile });
