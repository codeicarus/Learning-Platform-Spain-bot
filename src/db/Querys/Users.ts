import { Schema, model, Types } from "mongoose";

const userSchema = new Schema({
  _id: Types.ObjectId,
  name: String,
  email: String,
  password: String,
  telegram_id: Number,
});

export const user = model("usuarios", userSchema);
