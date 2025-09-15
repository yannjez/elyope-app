/*
  Warnings:

  - You are about to drop the column `sedationProtocol` on the `Exam` table. All the data in the column will be lost.
  - The `manifestationCategory` column on the `Exam` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paroxysmalSubtype` column on the `Exam` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."ManifestationCategory" AS ENUM ('PAROXYSMAL', 'STATUS_EPILEPTICUS', 'ALERTNESS', 'DISTURBANCE_OF_ALERTNESS', 'BEHAVIOR_CHANGES', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ParoxysmalSubtype" AS ENUM ('ISOLATED', 'GROUPED');

-- AlterTable
ALTER TABLE "public"."Exam" DROP COLUMN "sedationProtocol",
ADD COLUMN     "examConditionDescription" TEXT,
DROP COLUMN "manifestationCategory",
ADD COLUMN     "manifestationCategory" "public"."ManifestationCategory"[],
DROP COLUMN "paroxysmalSubtype",
ADD COLUMN     "paroxysmalSubtype" "public"."ParoxysmalSubtype";
