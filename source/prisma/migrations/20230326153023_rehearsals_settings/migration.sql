-- CreateTable
CREATE TABLE "Rehearsal" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "Rehearsal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "booking_days_ahead" INTEGER NOT NULL DEFAULT 7,
    "book_time_since" INTEGER NOT NULL DEFAULT 10,
    "book_time_till" INTEGER NOT NULL DEFAULT 18,
    "book_hours_offset" INTEGER NOT NULL DEFAULT 4,
    "book_minutes_offset" INTEGER NOT NULL DEFAULT 30,
    "book_duration_limit" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
