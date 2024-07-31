import { Schema, model, Types } from "mongoose";

const temasSchema = new Schema({
  _id: Types.ObjectId,
  name: String,
  abreviacion_publica: String,
  abreviacion: String,
  id_area: Types.ObjectId,
});

export const temasDb = model("temas", temasSchema);
