import express from "express";
import bot from "./bot.js";
import { webhookCallback } from "grammy";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

bot.api
  .setWebhook(`${process.env.WEBHOOK_URI}/webhook`)
  .then(() => {
    console.log("Webhook muvaffaqiyatli o'rnatildi...");
  })
  .catch((err) => {
    console.error("Webhookni o'rnatishda xatolik:", err);
  });

app.post("/webhook", webhookCallback(bot, "express"));

export default app;
