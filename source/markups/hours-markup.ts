import { Rehearsal } from "@prisma/client";
import { InlineKeyboard } from "grammy";
import { BotClients } from "../clients";
import { dateToString, offsetTime, stringToDate } from "../tools";

export const AVAILABLE_HOUR_CALLBACK = "available_hour";

function generateKeyboard(
  bookedRehearsals: Rehearsal[],
  date: Date,
  book: {
    since: number;
    till: number;
    offset: {
      hours: number;
      minutes: number;
    };
  }
): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  const today = new Date().getDate() === date.getDate();
  const startHour = offsetTime(today, book);

  for (let i = startHour, k = 1; i <= book.till; i++, k++) {
    if (
      bookedRehearsals.some(
        (reh: Rehearsal) => i >= reh.start && i < reh.start + reh.duration
      )
    ) {
      continue;
    }

    const hoursString = i < 10 ? `0${i}:00` : `${i}:00`;
    keyboard.text(
      hoursString,
      `${AVAILABLE_HOUR_CALLBACK}:${dateToString(date)}:${i}`
    );

    if (k % 4 === 0) keyboard.row();
  }

  return keyboard;
}

/**
 *
 * @param db database client
 * @returns `inlineKeyboard` instance with bookable hours in specified day
 */
export async function generateAvailableHours(
  db: BotClients["database"],
  date: string
): Promise<InlineKeyboard> {
  const settings = await db.settings.findFirst({
    where: { id: { equals: 1 } },
  });
  if (!settings) throw new Error("Settings object has invalid value");

  const bookedRehearsals = await db.rehearsal.findMany({
    where: { date: { equals: stringToDate(date) } },
    orderBy: { start: "asc" },
  });

  return generateKeyboard(bookedRehearsals, stringToDate(date), {
    since: settings.book_time_since,
    till: settings.book_time_till,
    offset: {
      hours: settings.book_hours_offset,
      minutes: settings.book_minutes_offset,
    },
  });
}
