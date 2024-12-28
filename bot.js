const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
require("dotenv").config();
const bot = new Telegraf(process.env.BOT_TOKEN); // Bot tokenni BotFather'dan oling

// Guruhga yangi a'zo qo'shilganda xabar berish
bot.on(message("new_chat_members"), (ctx) => {
  ctx.reply(`Xush kelibsiz, ${ctx.message.new_chat_members[0].first_name}! 😊`);
});

// Guruhdagi spam yoki nomaqbul xabarlarni o'chirish
bot.on(message("text"), (ctx) => {
  const spamWords = ["spam", "reklama", "havola"];
  if (spamWords.some((word) => ctx.message.text.toLowerCase().includes(word))) {
    ctx.deleteMessage(); // Xabarni o'chirish
    ctx.reply("Spamni guruhda ruxsat etilmaydi!");
  }

  const salommassiv = [
    "Assalomu alaykum",
    "salom",
    "yaxshimisizla",
    "xayrli kun!",
  ];
  if (
    salommassiv.some((word) => ctx.message.text.toLowerCase().includes(word))
  ) {
    ctx.reply(`Assalomu alaykum! qalesiz! ${ctx.message.from.first_name}`, {
      reply_to_message_id: ctx.message.message_id,
    });
  }

  // xabarga xabar echo
  ctx.reply(ctx.message.text, { reply_to_message_id: ctx.message.message_id });
});

// Botni ishga tushirish
bot.launch();
console.log("Bot ishlayapti...");
