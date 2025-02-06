import express, { json } from "express";
import { isHttpError } from "http-errors";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import { v2 as cloudinary } from "cloudinary";
import { createServer } from "http";
import { initializeSocket } from "./socket.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import commentRoutes from "./routes/comment.js";
import storyRoutes from "./routes/story.js";
import notificationRoutes from "./routes/notification.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://instapics.vercel.app",
  ],
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_SECRETKEY,
  secure: true,
});

app.use(cors(corsOptions));
app.use(compression());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.disable("x-powered-by");
app.get("/", (req, res) => {
  res.send("Hello express");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFoundHandler);
// Handle all errors
// app.use(errorHandler);

app.use((error, req, res, next) => {
  console.error(error);
  let errorMessage = "An unknown error has occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

app.set("io", io);

export { httpServer, io };
