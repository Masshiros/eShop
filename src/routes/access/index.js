const express = require("express");
const asyncHandler = require("../../middlewares/errorUtils");
const accessController = require("../../controllers/access.controller");
const { authentication } = require("../../middlewares/auth");
const router = express.Router();
router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/signin", asyncHandler(accessController.signIn));
router.post("/shop/refreshToken", asyncHandler(accessController.refreshToken));
// auth route
router.use(authentication);
router.post("/shop/signout", asyncHandler(accessController.signOut));
module.exports = router;
