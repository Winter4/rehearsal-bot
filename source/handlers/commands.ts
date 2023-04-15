import { Composer } from "grammy";
import { CustomContext } from "../types";

import { mainMenu } from "../markups/main-menu-markup";

const commands = new Composer<CustomContext>();

commands.command("start", async (ctx: CustomContext) => {
  return ctx.reply("Приветствую, музыкант! Порепетируем?", {
    reply_markup: mainMenu.keyboard,
  });
});

export default commands;
