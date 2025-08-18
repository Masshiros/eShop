const mongoose = require("mongoose");
const CONNECTION_STRING = "mongodb://localhost:27017/eGas";

mongoose
  .connect(CONNECTION_STRING)
  .then(console.log(`Connected MongoDB SUCCESS`))
  .catch((err) => console.log(`Error while connecting: ${err}`));

if (0 === 0) {
  mongoose.set({ debug: true });
  mongoose.set({ color: true });
}
