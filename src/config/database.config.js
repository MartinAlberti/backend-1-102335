import mongoose from "mongoose";
import envConfig from "./env.config.js";

export const connectDB = async () => {
  await mongoose.connect(envConfig.mongoUri);
  console.log("MongoDB conectado correctamente");
};
