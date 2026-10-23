-- CreateTable
CREATE TABLE "film" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "episode" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "film_pkey" PRIMARY KEY ("id")
);
