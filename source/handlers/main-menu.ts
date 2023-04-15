import { Composer } from "grammy";
import { CustomContext } from "../types";

import { mainMenu as mainMenuKeyboard } from "../markups/main-menu-markup";
import { generateAvailableDays } from "../markups/days-markup";

const mainMenu = new Composer<CustomContext>();

mainMenu.hears(
  mainMenuKeyboard.keys["Забронировать репетицию"],
  async (ctx: CustomContext) => {
    return ctx.reply("Выберите день", {
      reply_markup: await generateAvailableDays(ctx.db),
    });
  }
);

export default mainMenu;
