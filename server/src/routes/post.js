import express from "express";
import * as PostController from "../controllers/post.js";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";
import { apiLimiter } from "../middleware/rateLimit.js";
import { cacheMiddleware } from "../config/cache.js";

const router = express.Router();

router.post(
  "/createPost",
  apiLimiter,
  verifyAuth(Roles.All),
  PostController.createPost
);

router.get(
  "/getAllPosts",
  apiLimiter,
  verifyAuth(Roles.All),
  cacheMiddleware("get_allposts", 120),
  PostController.getAllPosts
);
router.patch(
  "/handleLikePost/:id",
  apiLimiter,
  verifyAuth(Roles.All),
  PostController.handleLikePost
);
router.get(
  "/seeWhoLiked/:id",
  apiLimiter,
  verifyAuth(Roles.All),
  cacheMiddleware("see_whoLiked", 120),
  PostController.seeWhoLiked
);
router.patch(
  "/handleSavePost/:id",
  verifyAuth(Roles.All),
  PostController.handleSavePost
);

router.get(
  "/getUserPosts/:id",
  apiLimiter,
  verifyAuth(Roles.All),
  cacheMiddleware("get_userPost", 120),
  PostController.getUserPosts
);

router.get(
  "/getUserSavedPosts/:id",
  apiLimiter,
  verifyAuth(Roles.All),
  cacheMiddleware("get_userSaved", 120),
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

router.get(
  "/random",
  apiLimiter,
  verifyAuth(Roles.All),
  cacheMiddleware("get_randomPost", 120),
  PostController.getRandomPosts
);

router.get(
  "/tag/:tags",
  apiLimiter,
  verifyAuth(Roles.All),
  cacheMiddleware("get_tags", 120),
  PostController.getPostsByTags
);

export default router;
