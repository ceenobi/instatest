import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/user.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://instapics.vercel.app",
        "wss://instapics.vercel.app",
      ],
      // origin: process.env.CORS_ORIGIN.split(","),
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"], // Add this
    allowEIO3: true, // Add this for compatibility
    path: "/socket.io/", // Explicitly set the path
    pingTimeout: 60000, // Increase timeout
    pingInterval: 25000, // Add heartbeat interval
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    try {
      if (!token) {
        return next(new Error("No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new Error("Invalid token"));
      }
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    // Join user's personal room
    socket.join(userId);

    console.log(`User ${userId} connected to socket`);

    socket.on("disconnect", () => {
      socket.leave(userId);
      console.log(`User ${userId} disconnected from socket`);
    });
  });

  return io;
};

export const sendNotification = (io, notification) => {
  try {
    if (!notification || !notification.recipient) {
      throw new Error("Invalid notification data");
    }
    // Send notification to the recipient
    io.to(notification.recipient.toString()).emit("notification", notification);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
