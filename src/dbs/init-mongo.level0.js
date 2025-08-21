const mongoose = require("mongoose");
const {
  db: { host, port, name },
} = require("../configs/config.mongo");
const CONNECTION_STRING = `mongodb://${host}:${port}/${name}`;

mongoose
  .connect(CONNECTION_STRING)
  .then(console.log(`Connected MongoDB SUCCESS`))
  .catch((err) => console.log(`Error while connecting: ${err}`));

if (0 === 0) {
  mongoose.set({ debug: true });
  mongoose.set({ color: true });
}
