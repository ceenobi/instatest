import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is not defined");
}

let connection = {};

export const connectToDb = async () => {
  try {
    if (connection.isConnected) {
      console.log("✅ Using existing MongoDB connection");
      return;
    }

    const db = await mongoose.connect(mongoUri, {
      dbName: "instapics",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    connection.isConnected = db.connections[0].readyState === 1;

    if (connection.isConnected) {
      console.log("✅ MongoDB connected successfully");

      // Handle connection events
      mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("❌ MongoDB disconnected");
        connection.isConnected = false;
      });

      process.on("SIGINT", async () => {
        await mongoose.connection.close();
        console.log("MongoDB connection closed through app termination");
        process.exit(0);
      });
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    connection.isConnected = false;
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
};
