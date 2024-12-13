import express from "express";
import * as UserController from "../controllers/user.js";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";
import { apiLimiter } from "../middleware/rateLimit.js";
import { cacheMiddleware } from "../config/cache.js";

const router = express.Router();

router.get(
  "/profile/:username",
  apiLimiter,
  verifyAuth(Roles.All),
  cacheMiddleware("user_profile", 300),
  UserController.getAUser
);
router.get(
  "/suggest",
  verifyAuth(Roles.All),
  cacheMiddleware("suggest_user", 120),
  UserController.suggestUsers
);
router.get(
  "/followers/:username",
  apiLimiter,
  verifyAuth(Roles.All),
  cacheMiddleware("get_followers", 120),
  UserController.getUserFollowers
);
router.get(
  "/following/:username",
  apiLimiter,
  verifyAuth(Roles.All),
  cacheMiddleware("get_following", 120),
  UserController.getUserFollowing
);

router.get("/search", verifyAuth(Roles.All), UserController.searchUsers);

router.patch(
  "/uploadProfilePic",
  apiLimiter,
  verifyAuth(Roles.All),
  UserController.changeProfilePhoto
);
router.patch(
  "/updateProfile",
  apiLimiter,
  verifyAuth(Roles.All),
  UserController.updateUserProfile
);
router.patch(
  "/updatePassword",
  apiLimiter,
  verifyAuth(Roles.All),
  UserController.updatePassword
);
router.patch(
  "/togglePrivacy",
  verifyAuth(Roles.All),
  UserController.togglePrivateAccount
);

router.delete(
  "/deleteAccount",
  verifyAuth(Roles.All),
  UserController.deleteAccount
);

router.patch("/follow/:id", verifyAuth(Roles.All), UserController.followUser);

export default router;
