const { Bot } = require("grammy");
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

function reverseMessage(messageUsers) {
  let message = "";
  for (let i = messageUsers.length - 1; i >= 0; i--) {
    message += messageUsers[i];
  }

  return message;
}

bot.start();
