-- CreateEnum
CREATE TYPE "public"."AnimalSpecies" AS ENUM ('CHIEN', 'CHAT', 'OTHER');

-- CreateTable
CREATE TABLE "public"."AnimalBreed" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "species" "public"."AnimalSpecies" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isArchive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AnimalBreed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Animal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" "public"."AnimalSpecies" NOT NULL,
    "breedId" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Animal" ADD CONSTRAINT "Animal_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "public"."AnimalBreed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
