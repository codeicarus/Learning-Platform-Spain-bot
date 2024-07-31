import mongoose, { model } from "mongoose";

const questionSchema = new mongoose.Schema({
  pregunta: {
    type: String,
  },
  explicacion: {
    type: String,
  },
  id_tema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "temas",
  },
  id_nivel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "niveles",
  },
  oficial: {
    type: Boolean,
  },
  anio_oficial: {
    type: String,
  },
  schemaid: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "files",
    },
  ],
  schema: [],
});

const answerSchema = new mongoose.Schema({
  respuesta: String,
  correcta: Boolean,
  id_pregunta: mongoose.Schema.Types.ObjectId,
});
export const question = model("preguntas", questionSchema);

export const answer = model("respuestas", answerSchema);
