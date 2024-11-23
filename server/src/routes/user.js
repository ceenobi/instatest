import express from "express";
import * as UserController from "../controllers/user.js";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";

const router = express.Router();


router.get("/:username", UserController.getAUser);

router.patch("/uploadProfilePic", verifyAuth(Roles.All), UserController.changeProfilePhoto);

export default router;