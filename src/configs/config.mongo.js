// db
const config = {
  db: {
    port: process.env.DB_PORT || "27017",
    host: process.env.DB_HOST || "localhost",
    name: process.env.DB_NAME || "eShop",
  },
};
module.exports = config;
