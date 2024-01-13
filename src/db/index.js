import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n MongoDB connected at DB Host : ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MongoDB Connection Error in DB/INDEX.JS: ", error);
    process.exit(1);
  }//5:24
};

export default connectDB;