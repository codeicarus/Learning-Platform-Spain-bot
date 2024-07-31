import { connect } from "mongoose";
import { URI_DB } from "../config/config";

const connectDB = async () => {
  try {
    await connect(URI_DB);
    console.log("DB Connected");
  } catch (error) {
    console.log("DB IS NOT CONNECTED");
  }
};

export default connectDB;
