-- CreateTable
CREATE TABLE "Rehearsal" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,

    CONSTRAINT "Rehearsal_pkey" PRIMARY KEY ("id")
);
