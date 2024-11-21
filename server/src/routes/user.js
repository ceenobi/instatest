import express from "express";
import * as AuthController from "../controllers/user.js";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";

const router = express.Router();

router.post("/signup", AuthController.signUp);
router.post("/signin", AuthController.signIn);


export default router;