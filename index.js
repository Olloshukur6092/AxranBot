const { Bot } = require("grammy");
const { reverseMessage } = require("./functions/messageFunction");
require("dotenv").config();

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.command("mevalar", (ctx) => {
  ctx.reply("Bu yerda sizga mevalar bor bo'ladi!!!");
});

bot.on(":text", (ctx) => {
  let text = reverseMessage(ctx.message.text);

  ctx.reply(text, {
    reply_parameters: { message_id: ctx.msg.message_id },
  });
});

bot.start();
