import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post is required"],
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
    },
    likes: {
      type: [String],
      default: [],
    },
    replyCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field to populate replies to this comment
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
});

// Pre-save middleware to ensure parentComment exists if it's set
commentSchema.pre('save', async function(next) {
  if (this.parentComment) {
    const parentExists = await this.constructor.findById(this.parentComment);
    if (!parentExists) {
      throw new Error('Parent comment does not exist');
    }
    // Increment reply count of parent comment
    await this.constructor.findByIdAndUpdate(
      this.parentComment,
      { $inc: { replyCount: 1 } }
    );
  }
  next();
});

const Comment = model("Comment", commentSchema);

export default Comment;
