import { Router } from "express";
import {
  createComment,
  getPostComments,
  getCommentReplies,
  deleteComment,
  toggleCommentLike,
} from "../controllers/comment.js";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";
import { apiLimiter } from "../middleware/rateLimit.js";
import { cacheMiddleware } from "../config/cache.js";

const router = Router();

// All routes require authentication
router.use(verifyAuth(Roles.All));

// Comment routes
router.post("/createComment/:getPostId", apiLimiter, createComment);
router.get(
  "/getPostComments/:postId",
  apiLimiter,
  cacheMiddleware("get_postComments", 120),
  getPostComments
);
router.get(
  "/:commentId/replies",
  apiLimiter,
  cacheMiddleware("get_commentReplies", 120),
  getCommentReplies
);
router.delete("/deleteComment/:commentId", deleteComment);
router.patch("/:commentId/like", toggleCommentLike);

export default router;
