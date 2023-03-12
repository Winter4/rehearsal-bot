// environment variables
import "dotenv/config";
import { Bot } from "grammy";

import { getConfig } from "./config";
import { BotClients, getClients } from "./clients";

import { CustomContext } from "./types";

import middlewares from "./middlewares";
import errorHandler from "./error-handler";
import commands from "./handlers/commands";
import buttons from "./handlers/buttons";

async function initSettings(db: BotClients["database"]) {
  // init bot
  const settingsNum = await db.settings.count();

  if (settingsNum === 0) {
    await db.settings.create({ data: {} });
  }
}

async function main() {
  // global app config
  const config = getConfig();
  // 3rd party clients, that should be inited
  const clients = getClients(config);

  // init bot instance
  const bot = new Bot<CustomContext>(config.telegram.botToken);

  // apply pre-scenes middlewares
  bot.use(...middlewares(clients));

  bot.use(commands);
  bot.use(buttons);

  await initSettings(clients.database);

  // error handler
  bot.catch(errorHandler(clients.logger));

  // run bot
  bot.start();
  clients.logger.info("🎵 Bot is ready to book some rehearsals");
}

main();
