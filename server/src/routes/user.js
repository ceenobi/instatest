import express from "express";
import * as UserController from "../controllers/user.js";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";

const router = express.Router();

router.get("/:username", UserController.getAUser);

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

export default router;
