import mongoose from "mongoose";
import log from "../utils/Logger";

const connectDB = async () => {
  const uri = process.env.MONGO_URI as string;

  if (!uri) {
    log.fatal().database("MONGO_URI is not defined in environment variables");
    process.exit(1);
  }

  log.info().database(`Initializing MongoDB connection...`);

  try {
    const conn = await mongoose.connect(uri);
    log.success().database(`MongoDB connection established: ${conn.connection.host}`);
  } catch (err) {
    log.fatal().database("MongoDB connection failed", err);
    process.exit(1);
  }

  const db = mongoose.connection;

  db.on("connecting", () => log.info().database("MongoDB connecting..."));
  db.on("connected", () => log.success().database("MongoDB connected"));
  db.on("disconnected", () => log.warn().database("MongoDB disconnected"));
  db.on("reconnected", () => log.success().database("MongoDB reconnected"));
  db.on("error", (error) => log.error().database("MongoDB error", error));
};

export default connectDB;
