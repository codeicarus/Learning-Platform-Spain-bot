import { Schema, model } from "mongoose";

const AreaSchema = new Schema({
  name: String,
});

export const areas = model("areas", AreaSchema);
