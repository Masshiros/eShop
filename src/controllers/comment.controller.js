const { SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  createComment = async (req, res, next) => {
    return new SuccessResponse({
      message: "Create new comment success",
      metadata: await CommentService.addComment({
        userId: req.session.userId,
        ...req.body,
      }),
    }).send(res);
  };
}
module.exports = new CommentController();
