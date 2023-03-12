-- CreateTable
CREATE TABLE "Rehearsal" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "Rehearsal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "booking_days_ahead" INTEGER NOT NULL DEFAULT 7,
    "book_time_since" INTEGER NOT NULL DEFAULT 9,
    "book_time_till" INTEGER NOT NULL DEFAULT 20,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
