import config from "config";
import mongoose from "mongoose";

const dbUrl = config.get<string>("mongoUrl");

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Database is Conected");
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
