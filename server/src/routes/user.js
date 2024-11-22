import express from "express";
import * as UserController from "../controllers/user.js";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";

const router = express.Router();


router.get("/:username", UserController.getAUser);

export default router;