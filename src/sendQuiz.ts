import { CTX, IGroupType, temas } from "./Types";
import {
  randomQuestion,
  sendContratosPublicos,
  sendOficial,
} from "./configPoll";
import { areas } from "./db/Querys/Areas";
import { answer, question } from "./db/Querys/Questions";
import { temasDb } from "./db/Querys/Temas";

const grupo: IGroupType = {
  id: -1001927944533,
  title: "Grupo 1: Penitenciarios",
};

const animationOptions = (index: number, replyId: number) => {
  const animsOBJ = {
    is_anonymous: false, // Si quieres que se muestre el nombre del usuario que responde
    type: "quiz", // El tipo de animación que quieres mostrar
    correct_option_id: index, // El índice de la opción correcta
    reply_to_message_id: replyId, // mensaje a responder
  };
  return animsOBJ;
};

export const sendQuiz = async (ctx: CTX, close: number) => {
  try {
    const area = await areas.find();
    // las 4 areas (pueden tener cualquier pregunta de cualquier tema relacionado al area)
    for (let a in area) {
      const name = area[a].name as string;
      randomQuestion(
        area[a]._id,
        ctx,
        temas[name].title,
        grupo.id,
        temas[name].id,
        close
      );
    }
    // Area especifica para LeyContratos Publicos
    sendContratosPublicos(
      ctx,
      grupo.id,
      temas.publico.title,
      temas.publico.id,
      close
    );

    // Oficiales
    sendOficial(ctx, grupo.id, temas.oficial.id, temas.oficial.title, close);
  } catch (error: any) {
    console.log(error.message);
    ctx.reply(error.message);
  }
};
