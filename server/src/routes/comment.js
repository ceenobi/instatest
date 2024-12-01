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
router.use(verifyAuth(Roles.All));

// Comment routes
router.post("/createComment/:getPostId", createComment);
router.get("/getPostComments/:postId", getPostComments);
router.get("/:commentId/replies", getCommentReplies);
router.delete("/deleteComment/:commentId", deleteComment);
router.patch("/:commentId/like", toggleCommentLike);

export default router;
