import { Composer } from "grammy";
import { CustomContext } from "../types";

import { mainMenuKeyboard } from "./markups";

const commands = new Composer<CustomContext>();

commands.command("start", (ctx: CustomContext) => {
  ctx.reply("Приветствую, музыкант! Порепетируем?", {
    reply_markup: mainMenuKeyboard,
  });
});

export default commands;
