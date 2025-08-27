const express = require("express");
const asyncHandler = require("../../middlewares/errorUtils");
const accessController = require("../../controllers/access.controller");
const router = express.Router();
router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/signin", asyncHandler(accessController.signIn));
module.exports = router;
