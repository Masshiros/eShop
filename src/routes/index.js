const express = require("express");
const router = express.Router();
const accessRouter = require("./access");
const { validateApiKey, validatePermission } = require("../middlewares/auth");
// middleware
router.use(validateApiKey);
router.use(validatePermission("0000"));
router.use("/v1/api", accessRouter);
module.exports = router;
