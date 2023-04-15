import { InlineKeyboard } from "grammy";
import { BotClients } from "../clients";
import { stringToDate } from "../tools";
import { Rehearsal } from "@prisma/client";

export const AVAILABLE_DURATION_CALLBACK = "available_duration";

function generateKeyboard(
  bookedRehearsals: Rehearsal[],
  date: string,
  hour: string,
  durationLimit: number
): InlineKeyboard {
  const keyboard = new InlineKeyboard().text(
    "1 час",
    `${AVAILABLE_DURATION_CALLBACK}:${date}:${hour}:1`
  );

  const bookedHour = Number(hour);
  for (let i = 1; i < durationLimit; i++) {
    if (
      bookedRehearsals.some((reh: Rehearsal) => reh.start === bookedHour + i)
    ) {
      break;
    } else {
      keyboard.text(
        `${i + 1} часа`,
        `${AVAILABLE_DURATION_CALLBACK}:${date}:${hour}:${i + 1}`
      );
    }
  }

  return keyboard;
}

export async function generateAvailableDurations(
  db: BotClients["database"],
  date: string,
  hour: string
): Promise<InlineKeyboard> {
  const settings = await db.settings.findFirst({
    where: { id: { equals: 1 } },
  });
  if (!settings) throw new Error("Settings object has invalid value");

  const bookedRehearsals = await db.rehearsal.findMany({
    where: {
      date: { equals: stringToDate(date) },
      start: { gte: Number(hour) + 1 },
    },
    orderBy: { start: "asc" },
  });

  return generateKeyboard(
    bookedRehearsals,
    date,
    hour,
    settings.book_duration_limit
  );
}
