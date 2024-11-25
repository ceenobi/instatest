import express from "express";
import * as PostController from "../controllers/post.js";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";

const router = express.Router();

router.post("/createPost", verifyAuth(Roles.All), PostController.createPost);

router.get("/getAllPosts", verifyAuth(Roles.All), PostController.getAllPosts);

export default router;
