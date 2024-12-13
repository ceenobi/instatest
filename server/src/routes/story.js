import express from "express";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";
import {
  createStory,
  getUserStories,
  viewStory,
  deleteStory,
  getFollowingStories,
  likeStory,
} from "../controllers/story.js";
import { apiLimiter } from "../middleware/rateLimit.js";
import { cacheMiddleware } from "../config/cache.js";

const router = express.Router();

router.post("/create", apiLimiter, verifyAuth(Roles.All), createStory);
router.get(
  "/user/:userId",
  apiLimiter,
  verifyAuth(Roles.All),
  cacheMiddleware("get_userStories", 120),
  getUserStories
);
router.get(
  "/following",
  apiLimiter,
  verifyAuth(Roles.All),
  cacheMiddleware("get_followingStories", 120),
  getFollowingStories
);
router.patch("/:storyId/view", verifyAuth(Roles.All), viewStory);
router.patch("/like/:storyId", verifyAuth(Roles.All), likeStory);
router.delete("/:storyId", verifyAuth(Roles.All), deleteStory);

export default router;
