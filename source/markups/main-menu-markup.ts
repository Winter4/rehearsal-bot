import { Rehearsal } from "@prisma/client";
import { InlineKeyboard, Keyboard } from "grammy";
import { BotClients } from "../clients";

export const BOOK_REHEARSAL_CALLBACK = "available_hour";

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
