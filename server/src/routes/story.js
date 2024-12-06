import express from "express";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";
import {
  createStory,
  getUserStories,
  viewStory,
  deleteStory,
  getFollowingStories
} from "../controllers/story.js";

const router = express.Router();

router.post("/create", verifyAuth(Roles.All), createStory);
router.get("/user/:userId", verifyAuth(Roles.All), getUserStories);
router.get("/following", verifyAuth(Roles.All), getFollowingStories);
router.patch("/:storyId/view", verifyAuth(Roles.All), viewStory);
router.delete("/:storyId", verifyAuth(Roles.All), deleteStory);

export default router;