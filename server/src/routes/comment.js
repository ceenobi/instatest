import { Router } from "express";
import {
  createComment,
  getPostComments,
  getCommentReplies,
  deleteComment,
  toggleCommentLike,
} from "../controllers/comment.js";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";

const router = Router();

// All routes require authentication
router.use(verifyAuth);

// Comment routes
router.post("/", createComment);
router.get("/post/:postId", getPostComments);
router.get("/:commentId/replies", getCommentReplies);
router.delete("/:commentId", deleteComment);
router.post("/:commentId/like", toggleCommentLike);

export default router;
