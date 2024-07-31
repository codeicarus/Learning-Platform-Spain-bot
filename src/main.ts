import { Telegraf } from "telegraf";
import { API_TOKEN } from "./config/config";
import connectDB from "./db/conn";
import * as command from "./commands";

connectDB();

const bot = new Telegraf(API_TOKEN);

bot.start((ctx) => {
  ctx.reply("ok");
});

bot.command("getTemas", command.getTemas);

bot.command("status", command.status);

bot.command("startSend", command.startSend);

bot.command("stopSend", command.stopSend);

bot.launch();
