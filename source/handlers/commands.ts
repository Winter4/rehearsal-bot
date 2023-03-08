import { Composer } from "grammy";
import { CustomContext } from "../types";

import { mainMenu } from "./markups";

const commands = new Composer<CustomContext>();

commands.command("start", (ctx: CustomContext) => {
  return ctx.reply("Приветствую, музыкант! Порепетируем?", {
    reply_markup: mainMenu.keyboard,
  });
});

export default commands;
