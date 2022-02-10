import prisma from "./prisma.js";
import TelegramBot from 'node-telegram-bot-api'
import dotenv from "dotenv"
dotenv.config()
const config = process.env

export const checkCapacity = async (booking: any) => {
  const currentCapacity = await prisma.booking.count({
    where: {
      service_id: booking.service_id,
      start_datetime: booking.start_datetime
    }
  })

  if (currentCapacity >= booking.service.capacity) {
    const bot = new TelegramBot(config.tBotToken!)
    bot.sendMessage(config.tChatId!, `${booking.service.name} at ${booking.start_datetime} has reached capacity.`)
  }
}
