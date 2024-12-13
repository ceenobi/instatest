import createHttpError from "http-errors";
import Notification from "../models/notification.js";
import { sendNotification } from "../socket.js";

// Create a new notification
export const createNotification = async (req, res, next) => {
  try {
    const { recipient, type, post, story, comment } = req.body;
    const sender = req.user.id;

    // Validate required fields
    if (!recipient || !type) {
      throw createHttpError(400, "Recipient and type are required");
    }

    // Prevent self-notifications
    if (recipient === sender) {
      throw createHttpError(400, "Cannot send notification to yourself");
    }

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      post,
      story,
      comment,
    });

    // Updated populate without execPopulate
    const populatedNotification = await Notification.findById(notification._id)
      .populate("sender", "username profilePicture")
      .populate("post", "media")
      .populate("story", "media");

    // Send real-time notification via WebSocket
    if (req.io) {
      sendNotification(req.io, populatedNotification);
    }

    res.status(201).json({
      success: true,
      notification: populatedNotification,
    });
  } catch (error) {
    // Handle mongoose duplicate key errors
    if (error.code === 11000) {
      return next(createHttpError(400, "Duplicate notification"));
    }
    next(error);
  }
};

// Get user's notifications
export const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("sender", "username profilePicture")
      .populate("post", "media")
      .populate("story", "media");

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      read: false,
    });

    res.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

// Mark notifications as read
export const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { notificationIds } = req.body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      throw createHttpError(400, "Invalid notification IDs");
    }

    await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        recipient: userId,
      },
      { read: true }
    );

    res.json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// Delete a notification
export const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw createHttpError(404, "Notification not found");
    }

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
