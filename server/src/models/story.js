import { Schema, model } from "mongoose";

const storySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    images: {
      type: [String],
      required: [true, "Image is required"],
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    imageIds: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "24h", // Automatically delete after 24 hours
    },
  },
  { timestamps: true }
);

const Story = model("Story", storySchema);

export default Story;
