import { Rehearsal } from "@prisma/client";
import { InlineKeyboard, Keyboard } from "grammy";
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

/**
 *
 * @param bookedRehearsals an array of booked rehearsals for one whole day
 * @returns 0/1 value array of 25 length (24 hours + 1, indexes start with 0); `array[10] = true` means `10-11am is booked`
 */
function parseDay(bookedRehearsals: Rehearsal[]) {
  // boilerplate array
  const rehearsals = new Array(25).fill(false);

  // every rehearsal has its time during the day
  for (const reh of bookedRehearsals) {
    for (let i = 0; i < reh.duration; i++) {
      rehearsals[reh.start + i] = true;
    }
  }

  return rehearsals;
}

/**
 *
 * @param bookedRehearsals an array of booked rehearsals for one whole day
 * @param time object, including `since` & `till` - indicates bookable day time
 * @returns `true` - there is at least 1 available hour left; `false` - no available hours left
 */
function checkDay(
  bookedRehearsals: Rehearsal[],
  time: { since: number; till: number }
) {
  // all-day-hours info
  const rehearsals = parseDay(bookedRehearsals);

  // finding at least 1 available hour
  for (let i = time.since; i <= time.till; i++) {
    if (!rehearsals[i]) return true;
  }

  return false;
}

/**
 *
 * @param db database client
 * @returns `inlineKeyboard` instance with bookable days
 */
export async function generateAvailableDays(
  db: BotClients["database"]
): Promise<InlineKeyboard> {
  const settings = await db.settings.findFirst({
    where: { id: { equals: 1 } },
  });
  if (!settings) throw new Error("Settings object has invalid value");
  const daysAhead = settings.booking_days_ahead;

  if (daysAhead === undefined || daysAhead < 1)
    throw new Error("booking_days_ahead setting has invalid value");

  // check bookings from
  const today = new Date();
  // till
  const bookBorder = new Date();
  bookBorder.setDate(bookBorder.getDate() + daysAhead - 1);

  const availableDays = [];

  // iteration per each day
  for (let i = 0; i < daysAhead; i++) {
    // day to be checked
    const day = new Date();
    day.setDate(today.getDate() + i);

    const bookedRehearsals = await db.rehearsal.findMany({
      where: { date: { equals: day } },
      orderBy: { start: "asc" },
    });

    if (
      checkDay(bookedRehearsals, {
        since: settings.book_time_since,
        till: settings.book_time_till,
      })
    ) {
      availableDays.push(day);
    }
  }

  const keyboard = new InlineKeyboard();
  for (let i = 0, k = 1; i < availableDays.length; i++, k++) {
    const day = availableDays[i];

    const dayString =
      day.getDate() < 10 ? `0${day.getDate()}` : `${day.getDate()}`;
    const monthString =
      day.getMonth() + 1 < 10
        ? `0${day.getMonth() + 1}`
        : `${day.getMonth() + 1}`;

    const dateString = `${dayString}.${monthString}`;
    keyboard.text(dateString, dateString);

    if (k % 4 === 0) keyboard.row();
  }

  return keyboard;
}
