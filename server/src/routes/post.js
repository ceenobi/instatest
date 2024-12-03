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

router.get(
  "/getUserPosts/:id",
  verifyAuth(Roles.All),
  PostController.getUserPosts
);

router.get(
  "/getUserSavedPosts/:id",
  verifyAuth(Roles.All),
  PostController.getUserSavedPosts
);

router.delete(
  "/deletePost/:id",
  verifyAuth(Roles.All),
  PostController.deletePost
);

router.patch(
  "/updatePost/:id",
  verifyAuth(Roles.All),
  PostController.updatePost
);

router.get("/random", verifyAuth(Roles.All), PostController.getRandomPosts);

export default router;
