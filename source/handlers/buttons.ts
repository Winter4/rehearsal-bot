import { Composer } from "grammy";
import { CustomContext } from "../types";

import { generateAvailableDays, mainMenu } from "./markups";

const buttons = new Composer<CustomContext>();

buttons.hears(
  mainMenu.keys["Забронировать репетицию"],
  (ctx: CustomContext) => {
    return ctx.reply("Выберите день", {
      reply_markup: generateAvailableDays(ctx.db),
    });
  }
);
