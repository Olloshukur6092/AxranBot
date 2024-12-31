import { Bot } from "grammy";
import { ContentType } from "./enums/ContentType.js";
import MessageService from "./services/MessageService.js";
import dotenv from "dotenv";
import { limit } from "@grammyjs/ratelimiter";
import Redis from "ioredis";
dotenv.config();
const bot = new Bot(process.env.BOT_TOKEN);

if (process.env.NODE_ENV === "production") {
  var redis = new Redis(process.env.REDIS_URL);
} else {
  var redis = new Redis();
}

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

bot.on(":new_chat_members", async (ctx) => {
  ctx.message.new_chat_members.forEach(async (newMember) => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const captchaQuestion = `${num1} + ${num2} necha?`;

    // Yangi foydalanuvchiga captcha yuborish
    await ctx.reply(
      `Assalomu alaykum, ${newMember.first_name}! \n${captchaQuestion}`
    );

    // To'g'ri javobni saqlash
    await redis.set(newMember.id.toString(), num1 + num2);
    await redis.set(`wrongAnswerCount:${newMember.id}`, 0);
  });
});

bot.on(":text", async (ctx) => {
  const userId = ctx.from.id.toString();
  const correctAnswer = await redis.get(userId);

  // Faqat yangi qo'shilgan foydalanuvchilar uchun tekshirish
  if (correctAnswer !== null) {
    const userAnswer = parseInt(ctx.message.text);
    let wrongAnswerCount =
      parseInt(await redis.get(`wrongAnswerCount:${userId}`)) || 0;

    if (userAnswer === parseInt(correctAnswer)) {
      await ctx.reply("Tabriklaymiz! Siz captcha ni to'g'ri topdingiz!");
      await redis.del(userId);
      await redis.del(`wrongAnswerCount:${userId}`);
    } else {
      wrongAnswerCount++;
      await redis.set(`wrongAnswerCount:${userId}`, wrongAnswerCount);

      await ctx.reply(
        `Xato! Iltimos, captcha ga to'g'ri javob bering. Urinishlar soni: ${wrongAnswerCount}`
      );

      if (wrongAnswerCount >= 3) {
        await ctx.banChatMember(userId);
        await ctx.reply(
          `<b>${ctx.from.first_name}</b>, siz <b>${wrongAnswerCount} marta</b> urinish qilib, captcha ga javob berolmadingiz va guruhdan chiqarildingiz.`,
          { parse_mode: "HTML" }
        );
        await redis.del(userId);
        await redis.del(`wrongAnswerCount:${userId}`);
      }
    }
  } else {
    return;
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
