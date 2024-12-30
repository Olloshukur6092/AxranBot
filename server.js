import e from "express";
import bot from "./bot.js";
import { webhookCallback } from "grammy";

const app = e();
app.use(e.json());

// Webhook URL ni loglash
const webhookURL = `${process.env.WEBHOOK_URI}/webhook`;
console.log("Webhook URL:", webhookURL);

bot.api
  .setWebhook(webhookURL)
  .then(() => {
    console.log("Webhook muvaffaqiyatli o‘rnatildi...");
  })
  .catch((err) => {
    console.error("Webhookni o‘rnatishda xatolik:", err);
  });

// Grammy webhookni Express serveriga ulash
app.post("/webhook", (req, res) => {
  console.log("Telegramdan kelgan so‘rov:", req.body);
  webhookCallback(bot, "express")(req, res).catch((err) => {
    console.error("Webhook so‘rovini qayta ishlashda xatolik:", err);
  });
});

export default app;
