import mongoose from "mongoose";

const connectDB = async () => {
  const message = "DB connected successfully";
  if (!process.env.MONGO_DB_URI) {
    throw new Error("MONGO_DB_URI is not defined");
  }
  const uri = process.env.MONGO_DB_URI;
  try {
    if (mongoose.connections[0].readyState === 1) {
      return message;
    }

    await mongoose.connect(uri);
    return message;
  } catch (error) {
    throw error;
  }
};

export default connectDB;
