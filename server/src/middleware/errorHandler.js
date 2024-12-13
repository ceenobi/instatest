import winston from "winston";
import createHttpError from "http-errors";

// Create a Winston logger instance
const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Log errors to a file
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    // Also log to console in development
    ...(process.env.NODE_ENV !== "production"
      ? [
          new winston.transports.Console({
            format: winston.format.simple(),
          }),
        ]
      : []),
  ],
});

// Custom error handler middleware
export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    user: req.user ? req.user.id : null,
  });

  // Determine status code
  const statusCode = err.status || err.statusCode || 500;
  // Send response
  res.status(statusCode).json({
    success: false,
    error:
      process.env.NODE_ENV === "production" ? "An error occurred" : err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

// 404 handler
export const notFoundHandler = (req, res, next) => {
  next(createHttpError(404, `Route ${req.originalUrl} not found`));
};
