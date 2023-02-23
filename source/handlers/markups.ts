import { Keyboard } from "grammy";

export const mainMenuKeyboard = new Keyboard()
  .text("Забронировать репетицию")
  .row()
  .text("Мои репетиции")
  .row()
  .resized();
