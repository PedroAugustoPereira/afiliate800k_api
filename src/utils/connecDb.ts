import { config } from "dotenv";
import mongoose from "mongoose";

config();
// const dbUrl = config.get<string>("mongoUrl");
const dbUrl = process.env.MONGO_URL || "";
console.log(process.env.PORT);

const connectDB = async () => {
  try {
    console.log(dbUrl);
    await mongoose.connect(dbUrl);
    console.log("Database is Conected");
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
