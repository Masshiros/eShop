const mongoose = require("mongoose");
const { countConnections } = require("../helpers/check-connection");
const CONNECTION_STRING = "mongodb://localhost:27017/eGas";

class Database {
  constructor() {
    this.connect();
  }
  connect() {
    if (0 === 0) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(CONNECTION_STRING)
      .then((_) =>
        console.log(`Connected MongoDB SUCCESS: ${countConnections()}`)
      )
      .catch((err) => console.log(`Error while connecting: ${err}`));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
module.exports = Database.getInstance();
