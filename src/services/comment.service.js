const { NotFoundResponseError } = require("../core/error.response");
const commentModel = require("../models/comment.model");
const { convertToObjectIdMongodb } = require("../utils");
const { findProduct } = require("./product.service");
class CommentService {
  static async addComment({ productId, userId, content, parentId = null }) {
    const comment = new commentModel({
      comment_content: content,
      comment_productId: productId,
      comment_userId: userId,
      comment_parentId: parentId,
    });
    let rightValue;
    if (parentId) {
      const parentComment = await commentModel.findById(parentId);
      if (!parentComment)
        throw new NotFoundResponseError("Parent comment not found");
      rightValue = parentComment.comment_right;
      // update many
      await commentModel.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        { $inc: { comment_right: 2 } }
      );
      await commentModel.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gte: rightValue },
        },
        { $inc: { comment_left: 2 } }
      );
    } else {
      const maxRightValue = await commentModel.findOne(
        {
          comment_productId: convertToObjectIdMongodb(productId),
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      );
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;
    await comment.save();
    return comment;
  }
  static async getListCommentsByParentId({
    productId,
    parentId,
    limit = 50,
    offset = 0,
  }) {
    if (parentId) {
      const parentComment = await commentModel.findById(parentId);
      if (!parentComment)
        throw new NotFoundResponseError("Parent comment not found");
      const comments = await commentModel
        .find({
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gt: parentComment.comment_left },
          comment_right: { $lt: parentComment.comment_right },
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        });
      return comments;
    }
    const parentComment = await commentModel.findById(parentId);
    if (!parentComment)
      throw new NotFoundResponseError("Parent comment not found");
    const comments = await commentModel
      .find({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_parentId: parentId,
      })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({
        comment_left: 1,
      });
    return comments;
  }
  static async deleteComments({ commentId, productId }) {
    // check product still valid
    const foundProduct = await findProduct({ product_id: productId });
    if (!foundProduct)
      throw new NotFoundResponseError({ message: "Product not found" });
    // identify left and right
    const comment = await commentModel.findById(commentId);
    if (!comment)
      throw new NotFoundResponseError({ message: "Comment not found" });
    const left = comment.comment_left;
    const right = comment.comment_right;
    // calculate width
    const width = right - left + 1;
    // delete all comment and its sub comment
    await commentModel.deleteMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_left: { $gte: left, $lte: right },
    });
    // update all comment
    await commentModel.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_right: { $gt: right },
      },
      {
        $inc: { comment_right: -width },
      }
    );
    await commentModel.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: left },
      },
      {
        $inc: { comment_right: -width },
      }
    );
  }
}
module.exports = CommentService;
