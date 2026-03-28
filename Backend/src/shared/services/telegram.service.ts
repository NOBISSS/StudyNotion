import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!);

export const sendAdminNotification = async (message:string) => {
  try {
    await bot.sendMessage(process.env.ADMIN_CHAT_ID!, message, {
      parse_mode: "HTML",
    });
  } catch (error) {
    console.error("Telegram Error:", error);
  }
};

