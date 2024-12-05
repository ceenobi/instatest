import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      trim: true,
    },
    viewers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '24h', // TTL index - delete after 24 hours
    }
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);

export default Story;
