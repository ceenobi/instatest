import express from "express";
import * as PostController from "../controllers/post.js";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";

const router = express.Router();

router.post("/createPost", verifyAuth(Roles.All), PostController.createPost);

router.get("/getAllPosts", verifyAuth(Roles.All), PostController.getAllPosts);
router.patch(
  "/handleLikePost/:id",
  verifyAuth(Roles.All),
  PostController.handleLikePost
);
router.get(
  "/seeWhoLiked/:id",
  verifyAuth(Roles.All),
  PostController.seeWhoLiked
);
router.patch(
  "/handleSavePost/:id",
  verifyAuth(Roles.All),
  PostController.handleSavePost
);
// router.patch(
//   "/unsavePost/:id",
//   verifyAuth(Roles.All),
//   PostController.unsavePost
// );
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
