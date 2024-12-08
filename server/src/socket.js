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
      ],
      // origin: process.env.CORS_ORIGIN.split(","),
      methods: ["GET", "POST"],
    },
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    try {
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(error);
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    
    // Join user's personal room
    socket.join(userId);

    console.log(`User ${userId} connected to socket`);

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected from socket`);
    });
  });

  return io;
};

export const sendNotification = (io, notification) => {
  // Send notification to the recipient
  io.to(notification.recipient.toString()).emit("notification", notification);
};
