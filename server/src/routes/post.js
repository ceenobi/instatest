import express from "express";
import * as PostController from "../controllers/post.js";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";

const router = express.Router();

router.post("/createPost", verifyAuth(Roles.All), PostController.createPost);

router.get("/getAllPosts", verifyAuth(Roles.All), PostController.getAllPosts);
router.patch("/likePost/:id", verifyAuth(Roles.All), PostController.likePost);
router.patch(
  "/unlikePost/:id",
  verifyAuth(Roles.All),
  PostController.unlikePost
);
router.get(
  "/seeWhoLiked/:id",
  verifyAuth(Roles.All),
  PostController.seeWhoLiked
);

// router.patch(
//     "/comment/:postId",
//     verifyAuth(Roles.All),
//     PostController.addComment
// );
// router.patch(
//     "/deleteComment/:postId/:commentId",
//     verifyAuth(Roles.All),
//     PostController.deleteComment
// );

export default router;
