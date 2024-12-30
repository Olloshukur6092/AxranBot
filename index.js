import { Bot } from "grammy";
import { configDotenv } from "dotenv";
import MessageService from "./services/MessageService.js";
import { ChatType } from "./enums/ChatType.js";
configDotenv();

const bot = new Bot(process.env.BOT_TOKEN);
const messageService = new MessageService();

bot.command("start", (ctx) => ctx.reply("Assalomu alaykum!"));
bot.on(":new_chat_members", (ctx) => {
  ctx.reply(`Assalomu alaykum, ${ctx.from.first_name}`, {
    reply_parameters: { message_id: ctx.msg.message_id },
  });
});

bot.on("message", async (ctx) => {
  if (
    ctx.chat.type === ChatType.GROUP ||
    ctx.chat.type === ChatType.SUPER_GROUP
  ) {
    const message = ctx.message;

    const chatMember = await ctx.getChatMember(ctx.from.id);

    const isAdminOrOwner = messageService.isAdminOrOwner(chatMember.status);

    if (!isAdminOrOwner && messageService.isUnwantedContent(message)) {
      try {
        await ctx.deleteMessage();
        await ctx.reply(
          `${ctx.from.first_name}, bu kontentga ruxsat berilmagan!`
        );
      } catch (err) {
        console.error("Xabarni o'chirishda xatolik:", err);
      }
    }
    if (messageService.checkMessage(ctx.message.text)) {
      ctx.reply(`Assalomu alaykum!, ${ctx.from.first_name}`, {
        reply_parameters: { message_id: ctx.msg.message_id },
      });
    }
  }
});

bot.start(() => {
  console.log("bot ishga tushdi...");
});
