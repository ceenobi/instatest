import {httpServer} from "./src/app.js";
import mongoose from "mongoose";
import { connectToDb } from "./src/config/database.js";

const port = process.env.PORT || 5007;
let server;

async function startServer() {
  try {
    // Connect to database
    await connectToDb();
    console.log("✅ Database connection established");

    // Start the server
    server = httpServer.listen(port, () => {
      console.log("\n🚀 Server started successfully");
      console.log(`✅ Server is running on port ${port}`);
      console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}\n`);
    });

    // Handle server errors
    server.on("error", (error) => {
      console.error("❌ Server error:", error);
      process.exit(1);
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("❌ Uncaught Exception:", error);
      gracefulShutdown("UNCAUGHT_EXCEPTION");
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (error) => {
      console.error("❌ Unhandled Rejection:", error);
      gracefulShutdown("UNHANDLED_REJECTION");
    });

    // Handle graceful shutdown
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

async function gracefulShutdown(signal) {
  console.log(`\n${signal} signal received. Starting graceful shutdown...`);
  
  try {
    // Close server first to stop accepting new connections
    if (server) {
      await new Promise((resolve) => {
        server.close((err) => {
          if (err) {
            console.error("❌ Error closing server:", err);
            resolve();
          } else {
            console.log("✅ Server closed successfully");
            resolve();
          }
        });
      });
    }

    // Close database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("✅ Database connection closed");
    }

    console.log("✅ Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during graceful shutdown:", error);
    process.exit(1);
  }
}

// Start the server
startServer();