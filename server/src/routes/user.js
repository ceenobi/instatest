import express from "express";
import * as UserController from "../controllers/user.js";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";

const router = express.Router();

router.get("/:username", verifyAuth(Roles.All), UserController.getAUser);
router.get("/suggest", verifyAuth(Roles.All), UserController.suggestUsers);

router.patch(
  "/uploadProfilePic",
  verifyAuth(Roles.All),
  UserController.changeProfilePhoto
);
router.patch(
  "/updateProfile",
  verifyAuth(Roles.All),
  UserController.updateUserProfile
);
router.patch(
  "/updatePassword",
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
