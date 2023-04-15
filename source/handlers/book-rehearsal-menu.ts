import { Composer, InlineKeyboard } from "grammy";
import { CustomContext } from "../types";
import { AVAILABLE_DAY_CALLBACK } from "../markups/days-markup";
import {
  AVAILABLE_HOUR_CALLBACK,
  generateAvailableHours,
} from "../markups/hours-markup";
import {
  AVAILABLE_DURATION_CALLBACK,
  generateAvailableDurations,
} from "../markups/durations-markup";
import { stringToDate } from "../tools";

const bookMenu = new Composer<CustomContext>();

// dd.mm inline button
bookMenu.callbackQuery(
  new RegExp(`${AVAILABLE_DAY_CALLBACK}:.*`),
  async (ctx: CustomContext) => {
    ctx.answerCallbackQuery();

    const data = ctx.callbackQuery?.data;
    if (!data) {
      throw new Error("Empty callback data on available day button click");
    }
    const dateString = data.split(":")[1];

    // edit the same message to show available hours during chosen day
    return ctx.editMessageText("Выберите время", {
      reply_markup: await generateAvailableHours(ctx.db, dateString),
    });
  }
);

// hh.mm inline button
bookMenu.callbackQuery(
  new RegExp(`${AVAILABLE_HOUR_CALLBACK}:.*`),
  async (ctx: CustomContext) => {
    ctx.answerCallbackQuery();

    const data = ctx.callbackQuery?.data;
    if (!data) {
      throw new Error("Empty callback data on available hour button click");
    }

    const splitted = data.split(":");
    const dateString = splitted[1];
    const hourString = splitted[2];

    // edit the same message to show available durations
    return ctx.editMessageText("Выберите длительность", {
      reply_markup: await generateAvailableDurations(
        ctx.db,
        dateString,
        hourString
      ),
    });
  }
);

// duration inline button
bookMenu.callbackQuery(
  new RegExp(`${AVAILABLE_DURATION_CALLBACK}:.*`),
  async (ctx: CustomContext) => {
    ctx.answerCallbackQuery();

    const data = ctx.callbackQuery?.data;
    if (!data) {
      throw new Error("Empty callback data on available duration button click");
    }

    const splitted = data.split(":");
    const date = splitted[1];
    const hour = splitted[2];
    const duration = splitted[3];

    if (!ctx.from?.id) {
      ctx.answerCallbackQuery("Неизвестный ID пользователя");
      throw new Error("Invalid userID on available duration button click");
    }

    await ctx.db.rehearsal.create({
      data: {
        user_id: ctx.from?.id.toString(),
        date: stringToDate(date),
        start: Number(hour),
        duration: Number(duration),
      },
    });

    return ctx.editMessageText("Репетиция успешно забронирована!", {
      reply_markup: new InlineKeyboard(),
    });
  }
);

export default bookMenu;
