import { Bot } from "grammy";
import { ContentType } from "./enums/ContentType.js";
import MessageService from "./services/MessageService.js";
import dotenv from "dotenv";
dotenv.config();
const bot = new Bot(process.env.BOT_TOKEN);

const messageService = new MessageService();

bot.command("start", (ctx) => ctx.reply("Assalomu alaykum!"));
bot.on(":new_chat_members", (ctx) => {
  ctx.reply(`Assalomu alaykum, ${ctx.from.first_name}`, {
    reply_parameters: { message_id: ctx.msg.message_id },
  });
});

bot.on("message:video", async (ctx) => {
  await messageService.handleUnWantedContent(ctx, ContentType.VIDEO);
});

bot.on("message:voice", async (ctx) => {
  await messageService.handleUnWantedContent(ctx, ContentType.VOICE);
});

bot.on("message:audio", async (ctx) => {
  await messageService.handleUnWantedContent(ctx, ContentType.AUDIO);
});

bot.on("message:photo", async (ctx) => {
  await messageService.handleUnWantedContent(ctx, ContentType.PHOTO);
});

bot.on("message::url", async (ctx) => {
  await messageService.handleUnWantedContent(ctx, ContentType.URL);
});

bot.on("message:document", async (ctx) => {
  await messageService.handleUnWantedContent(ctx, ContentType.DOCUMENT);
});

export default bot;
