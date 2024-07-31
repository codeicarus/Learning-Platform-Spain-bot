import { CTX } from "./Types";
import { areas } from "./db/Querys/Areas";
import { answer, question } from "./db/Querys/Questions";
import { temasDb } from "./db/Querys/Temas";
import { Types } from "mongoose";

const animationOptions = (index: number, replyId: number) => {
  const animsOBJ = {
    is_anonymous: false, // Si quieres que se muestre el nombre del usuario que responde
    type: "quiz", // El tipo de animación que quieres mostrar
    correct_option_id: index, // El índice de la opción correcta
    reply_to_message_id: replyId, // mensaje a responder
  };
  return animsOBJ;
};

export const sendPoll = async (
  ctx: CTX,
  id_grupo: number,
  tema_title: string,
  question: string,
  respuestas: string[],
  explicacion: string,
  indexCorrecto: number,
  reply_id: number,
  close: number
) => {
  try {
    const poll = await ctx.telegram.sendPoll(
      id_grupo,
      "Pregunta de " + tema_title + "\n\n" + question,
      respuestas,
      animationOptions(indexCorrecto, reply_id)
    );

    setTimeout(() => {
      ctx.telegram.stopPoll(id_grupo, poll.message_id);
      ctx.telegram.sendMessage(id_grupo, explicacion, {
        reply_to_message_id: poll.message_id,
      });
    }, close);
  } catch (error: any) {
    console.log(error.message);
    console.log("Se salto un errror"); // para evitar que deje de ejecutarse
  }
};

export const randomQuestion = async (
  id_Area: Types.ObjectId,
  ctx: CTX,
  tema_name: string,
  id_grupo: number,
  reply_id: number,
  close: number
) => {
  //Buscar un tema aleatorio de ese area
  const temaDB = await temasDb.aggregate([
    { $match: { id_area: id_Area } },
    { $sample: { size: 1 } },
  ]);

  // //Buscar una pregunta aleatoria de ese tema
  const questionDB = await question.aggregate([
    { $match: { id_tema: temaDB[0]._id } },
  ]);
  // //Buscamos las respuestas de esa pregunta
  const answerDB = await answer.find({
    id_pregunta: questionDB[0]._id,
  });

  let indexCorrecto = 0;

  const respuestas = answerDB
    .map((ans, index) => {
      if (ans.correcta) indexCorrecto = index;
      return ans.respuesta;
    }) // Mapear todas las respuestas, incluso las undefined
    .filter((ans) => ans !== undefined) // Filtrar las respuestas undefined
    .map((ans) => ans!); // Realizar un mapeo adicional asegurando que no sean undefined

  sendPoll(
    ctx,
    id_grupo,
    tema_name,
    questionDB[0].pregunta,
    respuestas,
    questionDB[0].explicacion,
    indexCorrecto,
    reply_id,
    close
  );
};

//#############################################
//#############################################
//#############################################

export const sendOficial = async (
  ctx: CTX,
  id_grupo: number,
  reply_id: number,
  tema_name: string,
  close: number
) => {
  const question_oficial = await question.aggregate([
    { $match: { oficial: true } },
    { $sample: { size: 1 } },
  ]);
  const answerDB = await answer.find({
    id_pregunta: question_oficial[0]._id,
  });

  let indexCorrecto: number = 0;

  const respuestas = answerDB
    .map((ans, index) => {
      if (ans.correcta) indexCorrecto = index;
      return ans.respuesta;
    }) // Mapear todas las respuestas, incluso las undefined
    .filter((ans) => ans !== undefined) // Filtrar las respuestas undefined
    .map((ans) => ans!); // Realizar un mapeo adicional asegurando que no sean undefined

  sendPoll(
    ctx,
    id_grupo,
    tema_name,
    question_oficial[0].pregunta,
    respuestas,
    question_oficial[0].explicacion,
    indexCorrecto,
    reply_id,
    close
  );
};

export const sendContratosPublicos = async (
  ctx: CTX,
  id_grupo: number,
  tema_name: string,
  reply_id: number,
  close: number
) => {
  try {
    const area_contratos = await areas.findOne({
      name: "derecho administrativo y función pública",
    });

    if (!area_contratos) return;

    const tema_area = await temasDb.findOne({
      id_area: area_contratos._id,
      abreviacion_publica: "T10",
    });

    if (!tema_area) return;
    if (!tema_area.name) return;

    const question_contratos = await question.aggregate([
      { $match: { id_tema: tema_area._id } },
      { $sample: { size: 1 } },
    ]);

    const answerDB = await answer.find({
      id_pregunta: question_contratos[0]._id,
    });

    let indexCorrecto: number = 0;

    const respuestas = answerDB
      .map((ans, index) => {
        if (ans.correcta) indexCorrecto = index;
        return ans.respuesta;
      }) // Mapear todas las respuestas, incluso las undefined
      .filter((ans) => ans !== undefined) // Filtrar las respuestas undefined
      .map((ans) => ans!); // Realizar un mapeo adicional asegurando que no sean undefined

    sendPoll(
      ctx,
      id_grupo,
      tema_name,
      question_contratos[0].pregunta,
      respuestas,
      question_contratos[0].explicacion,
      indexCorrecto,
      reply_id,
      close
    );
  } catch (error) {}
};
