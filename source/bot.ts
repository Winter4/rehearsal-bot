// environment variables
import "dotenv/config";
import { Bot } from "grammy";

import { getConfig } from "./config";
import { getClients } from "./clients";

import { CustomContext } from "./types";

import middlewares from "./middlewares";
import errorHandler from "./error-handler";
import commands from "./handlers/commands";

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

  // error handler
  bot.catch(errorHandler(clients.logger));

  // run bot
  bot.start();
  clients.logger.info("🎵 Bot is ready to book some rehearsals");
}

main();
