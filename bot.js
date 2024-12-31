import { Bot } from "grammy";
import { ContentType } from "./enums/ContentType.js";
import MessageService from "./services/MessageService.js";
import dotenv from "dotenv";
import { limit } from "@grammyjs/ratelimiter";
import Redis from "ioredis";
dotenv.config();
const bot = new Bot(process.env.BOT_TOKEN);
const redis = new Redis();

const messageService = new MessageService();

bot.command(
  "start",
  limit({
    timeFrame: 60000, // 2 soniya
    limit: 3, // 3 ta so'rov
    onLimitExceeded: async (ctx) => {
      await ctx.reply("Iltimos, juda ko'p so'rov yuborishdan saqlaning!");
    },
    keyGenerator: (ctx) => ctx.from?.id.toString(),
  }),
  async (ctx) => {
    await ctx.reply(
      `Assalomu alaykum, ${ctx.from.first_name}! Botga xush kelibsiz.`
    );
  }
);

bot.on(":new_chat_members", (ctx) => {
  ctx.message.new_chat_members.forEach((newMember) => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const captchaQuestion = `${num1} + ${num2} necha?`;

    // Yangi foydalanuvchining ID sini olish
    const userId = newMember.id;

    ctx.reply(
      `Assalomu alaykum, ${newMember.first_name}! \n${captchaQuestion}`
    );

    // Javobni yangi foydalanuvchining ID si bilan saqlash
    redis.set(userId.toString(), num1 + num2);
  });
});

bot.on(":text", async (ctx) => {
  const userAnswer = parseInt(ctx.message.text);

  const correctAnswer = await redis.get(ctx.from.id.toString()); // Javobni olish
  let wrongAnswerCount = (await redis.get("wrongAnswerCount")) || 0;

  if (correctAnswer !== null) {
    if (userAnswer === parseInt(correctAnswer)) {
      await ctx.reply("Tabriklaymiz! Siz captcha ni to'g'ri topdingiz!");
      await redis.del(ctx.from.id.toString()); // Javobni o'chirish
      await redis.del("wrongAnswerCount");
    } else {
      wrongAnswerCount++;
      redis.set("wrongAnswerCount", wrongAnswerCount);

      await ctx.reply(
        `Xato! Iltimos, captcha ga to'g'ri javob bering. Urinishlar soni ${wrongAnswerCount}`
      );

      if (wrongAnswerCount >= 3) {
        await ctx.banChatMember(ctx.from.id);
        await ctx.reply(
          `<b>${ctx.from.first_name}</b> siz <b>${wrongAnswerCount} marta</b> urinish qilib captchaga javob berolmadingiz va guruhdan chiqarildingiz`,
          {
            parse_mode: "HTML",
          }
        );
        await redis.del(ctx.from.id.toString());
        await redis.del("wrongAnswerCount");
      }
    }
  } else {
    ctx.reply("<b>Sizga captcha berilmagan.</b>", {
      parse_mode: "HTML",
    });
  }
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




