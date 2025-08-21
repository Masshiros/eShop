const app = require("./src/app");
const appConfig = require("./src/configs/config.app");
const PORT = appConfig.port || 3009;
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
