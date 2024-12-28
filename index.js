const { Bot } = require("grammy");
require("dotenv").config();

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.command("mevalar", (ctx) => {
  ctx.reply("Bu yerda sizga mevalar bor bo'ladi!!!");
});

bot.start();
