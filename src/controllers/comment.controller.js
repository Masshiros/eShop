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
  getListComments = async (req, res, next) => {
    return new SuccessResponse({
      message: " Get list comment success",
      metadata: await CommentService.getListCommentsByParentId({
        ...req.body,
      }),
    });
  };
  deleteComments = async (req, res, next) => {
    return new SuccessResponse({
      message: "Delete comment success",
      metadata: await CommentService.deleteComments({
        ...req.body,
      }),
    });
  };
}
module.exports = new CommentController();
