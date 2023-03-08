import { Keyboard } from "grammy";
import { BotClients } from "../clients";

// alias = value
enum mainMenuKeys {
  "Забронировать репетицию" = "Забронировать репетицию",
  "Мои репетиции" = "Мои репетиции",
}
export const mainMenu = {
  keys: mainMenuKeys,
  keyboard: new Keyboard()
    .text(mainMenuKeys["Забронировать репетицию"])
    .row()
    .text(mainMenuKeys["Мои репетиции"])
    .row()
    .resized(),
};

export function generateAvailableDays(db: BotClients["database"]): Keyboard {
  return new Keyboard();
}
