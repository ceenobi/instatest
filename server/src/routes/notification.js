import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notification.js";
import { Roles, verifyAuth } from "../middleware/verifyAuth.js";

const router = express.Router();

router.post("/create", verifyAuth(Roles.All), createNotification);
router.get("/", verifyAuth(Roles.All), getUserNotifications);
router.patch("/mark-read", verifyAuth(Roles.All), markAsRead);
router.delete("/:notificationId", verifyAuth(Roles.All), deleteNotification);

export default router;
