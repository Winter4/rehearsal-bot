import { Rehearsal } from "@prisma/client";
import { InlineKeyboard } from "grammy";
import { BotClients } from "../clients";
import { dateToString, offsetTime } from "../tools";

export const AVAILABLE_DAY_CALLBACK = "available_day";

/**
 *
 * @param rehearsals an array of booked rehearsals for one whole day
 * @param today `true` if checked day is today
 * @param book object, including `since` & `till` - indicates bookable day time
 * @returns `true` - there is at least 1 available hour left; `false` - no available hours left
 */
function checkDay(
  rehearsals: Rehearsal[],
  today: Boolean,
  book: {
    since: number;
    till: number;
    offset: {
      hours: number;
      minutes: number;
    };
  }
) {
  const startHour = offsetTime(today, book);

  // finding at least 1 available hour
  for (let i = startHour; i <= book.till; i++) {
    if (!rehearsals.some((reh: Rehearsal) => (reh.start = i))) return true;
  }

  return false;
}

function generateKeyboard(availableDays: Date[]): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  for (let i = 0, k = 1; i < availableDays.length; i++, k++) {
    const dateString = dateToString(availableDays[i]);
    keyboard.text(
      dateString.slice(0, 5),
      `${AVAILABLE_DAY_CALLBACK}:${dateString}`
    );

    if (k % 4 === 0) keyboard.row();
  }

  return keyboard;
}

/**
 *
 * @param db database client
 * @returns `inlineKeyboard` instance with bookable days
 */
export async function generateAvailableDays(
  db: BotClients["database"]
): Promise<InlineKeyboard> {
  // typescript checks
  const settings = await db.settings.findFirst({
    where: { id: { equals: 1 } },
  });
  if (!settings) throw new Error("Settings object has invalid value");

  const daysAhead = settings.booking_days_ahead;
  if (daysAhead === undefined || daysAhead < 1)
    throw new Error("booking_days_ahead setting has invalid value");
  // - - -

  // bookings from
  const today = new Date();

  // resulting array, that would be converted to keyboard
  const availableDays = [];

  // iteration per each day
  for (let i = 0; i < daysAhead; i++) {
    // day to be checked
    const day = new Date();
    day.setDate(today.getDate() + i);

    // get rehearsals for this day
    const bookedRehearsals = await db.rehearsal.findMany({
      where: { date: { equals: day } },
      orderBy: { start: "asc" },
    });

    // if there is available hour in this day
    if (
      checkDay(bookedRehearsals, i === 0, {
        since: settings.book_time_since,
        till: settings.book_time_till,
        offset: {
          hours: settings.book_hours_offset,
          minutes: settings.book_minutes_offset,
        },
      })
    ) {
      // mark the day as available
      availableDays.push(day);
    }
  }

  return generateKeyboard(availableDays);
}
