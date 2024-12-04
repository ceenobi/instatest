import express from "express";
import * as StoryController from "../controllers/story.js";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";

const router = express.Router();

router.post(
    "/createStory",
    verifyAuth(Roles.All),
    StoryController.createStory
);

export default router;