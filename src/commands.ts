import cron, { ScheduledTask } from "node-cron";
import { CTX, ITimeTask } from "./Types";
import { IAreaSchema } from "./Types";
import { areas } from "./db/Querys/Areas";
import { sendQuiz } from "./sendQuiz";

let cronFunction: ScheduledTask | undefined;

const user_admin: number[] = [6584389750, 6297259055, 2060434250];

const timesTasks: ITimeTask[] = [
  { open: "0 8 * * *", close: 5 * 60 * 60 * 1000 }, // inicia 08:00 AM y cierra en 5hr (13:00 PM)
  { open: "30 15 * * *", close: 4 * 60 * 60 * 1000 }, // Inicia a las 15:30 PM y cierra en 4hr (19:30 PM)
];

// const timesTasks: ITimeTask[] = [{ open: "* * * * *", close: 10000 }];

const check = (id: number) => {
  if (user_admin.includes(id)) return true;
  else throw new Error("No autorizado");
};

//#########################################
//#########################################

export const getTemas = async (ctx: CTX) => {
  try {
    check(ctx.message.from.id);
    const data: IAreaSchema[] = await areas.find();
    let result = "";
    data.forEach(
      (area) => (result += "```" + area._id + "```" + "\n" + area.name + "\n\n")
    );
    ctx.replyWithMarkdownV2(result);
  } catch (error: any) {
    ctx.reply(error.message);
  }
};

export const status = (ctx: CTX) => {
  ctx.reply(
    `#######################\nUserID: ${ctx.message.from.id}\nUsername: @${ctx.message.from.username}\n#######################`
  );
};

// export const dp = async (ctx: CTX) => {
//   const data = await ctx.reply(
//     `📚🔍 ¡grupo de Derecho Penitenciario! 📊💬 Aquí podrás discutir y hacer preguntas sobre el tema. ¡Nuestro bot lanzará encuestas para poner a prueba tus conocimientos! 🧠📝 ¡Esperamos que disfrutes aprendiendo y compartiendo!`
//   );
//   console.log(data.message_id);
// };

// export const fp = async (ctx: CTX) => {
//   const data = await ctx.reply(
//     `📚🔍 ¡grupo de Función Pública! 📊💬 Aquí podrás discutir y hacer preguntas sobre el tema. ¡Nuestro bot lanzará encuestas para poner a prueba tus conocimientos! 🧠📝 ¡Esperamos que disfrutes aprendiendo y compartiendo!`
//   );
//   console.log(data.message_id);
// };

// export const dpl = async (ctx: CTX) => {
//   const data = await ctx.reply(
//     `📚🔍 ¡grupo de Derecho Penal! 📊💬 Aquí podrás discutir y hacer preguntas sobre el tema. ¡Nuestro bot lanzará encuestas para poner a prueba tus conocimientos! 🧠📝 ¡Esperamos que disfrutes aprendiendo y compartiendo!`
//   );
//   console.log(data.message_id);
// };

// export const ch = async (ctx: CTX) => {
//   const data = await ctx.reply(
//     `📚🔍 ¡grupo de Conducta Humana! 📊💬 Aquí podrás discutir y hacer preguntas sobre el tema. ¡Nuestro bot lanzará encuestas para poner a prueba tus conocimientos! 🧠📝 ¡Esperamos que disfrutes aprendiendo y compartiendo!`
//   );
//   console.log(data.message_id);
// };

// export const lcp = async (ctx: CTX) => {
//   const data = await ctx.reply(
//     `📚🔍 ¡grupo de Ley Contratos Públicos! 📊💬 Aquí podrás discutir y hacer preguntas sobre el tema. ¡Nuestro bot lanzará encuestas para poner a prueba tus conocimientos! 🧠📝 ¡Esperamos que disfrutes aprendiendo y compartiendo!`
//   );
//   console.log(data.message_id);
// };

// export const po = async (ctx: CTX) => {
//   const data = await ctx.reply(
//     `📚🔍 ¡grupo de Preguntas Oficiales! 📊💬 Aquí podrás discutir y hacer preguntas sobre el tema. ¡Nuestro bot lanzará encuestas para poner a prueba tus conocimientos! 🧠📝 ¡Esperamos que disfrutes aprendiendo y compartiendo!`
//   );
//   console.log(data.message_id);
// };

export const startSend = async (ctx: CTX) => {
  try {
    check(ctx.message.from.id);
    if (cronFunction)
      throw Error("El bot ya esta activado \nDetenga el bot con /stopSend");

    ctx.reply("¡Hola! Bot activado.");

    timesTasks.forEach((TaskTime) => {
      cronFunction = cron.schedule(TaskTime.open, async () => {
        sendQuiz(ctx, TaskTime.close);
      });

      cronFunction.start();
    });
  } catch (error: any) {
    ctx.reply(error.message);
  }
};

export const stopSend = async (ctx: CTX) => {
  try {
    check(ctx.message.from.id);
    if (!cronFunction)
      throw Error(
        "El bot no esta activado\nActivelo usando el comando\n/startSend"
      );
    cronFunction.stop();
    ctx.reply("¡Hola! Bot desactivado.");
  } catch (error: any) {
    ctx.reply(error.message);
  }
};
