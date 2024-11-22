import express, { json } from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/user.js";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174", "https://instapics.vercel.app"],
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(compression());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

app.disable("x-powered-by");
app.get("/", (req, res) => {
  res.send("Hello express");
});

app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
  return next(createHttpError(404, "Endpoint not found"));
});

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

export default app;
