const express = require("express");
const asyncHandler = require("../../middlewares/errorUtils");

const { authentication } = require("../../middlewares/auth");
const commentController = require("../../controllers/comment.controller");

const router = express.Router();

// auth route
router.use(authentication);
router.post("", asyncHandler(commentController.createComment));
router.get("", asyncHandler(commentController.getListComments));
router.delete("", asyncHandler(commentController.deleteComments));
module.exports = router;
