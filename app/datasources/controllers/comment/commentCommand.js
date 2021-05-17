const { getFields } = require('../../utils/controllers');
const { Comment, Post } = require('../../models');

async function createComment(args, context) {
  try {
    args.input.user = context.user._id;

    const foundPost = await Post.countDocuments({ _id: args.input.post });
    if (!foundPost) {
      return {
        isSuccess: false,
        message: 'Post not found',
      };
    }

    if (args.input.parent) {
      const parentComment = await Comment.findById({ _id: args.input.parent }).select('post').lean();
      if (!parentComment) {
        return {
          isSuccess: false,
          message: 'Parent comment not found',
        };
      }

      if (parentComment.post.toString() !== args.input.post) {
        return {
          isSuccess: false,
          message: 'Parent comment not in this post',
        };
      }
    }

    const comment = await Comment.create(args.input);

    return {
      isSuccess: true,
      comment,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function updateComment(args, context, info) {
  try {
    const { _id, input } = args;
    const { user } = context;

    const comment = await Comment.findOneAndUpdate(
      { _id, user },
      input,
      { fields: getFields(info, 'comment'), new: true },
    ).lean();
    if (!comment) {
      return {
        isSuccess: false,
        message: 'Comment not found',
      };
    }

    return {
      isSuccess: true,
      comment,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function deleteComment(args, context) {
  try {
    args.user = context.user._id;
    const comment = await Comment.deleteOne(args);
    if (!comment.deletedCount) {
      return {
        isSuccess: false,
        message: 'Comment not found',
      };
    }

    await Comment.deleteMany({ parent: args._id });

    return {
      isSuccess: true,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};
