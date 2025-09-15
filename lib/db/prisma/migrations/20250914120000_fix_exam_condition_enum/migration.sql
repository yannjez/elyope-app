/*
  Warnings:

  - Changed the type of `examCondition` on the `Exam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ExamCondition" AS ENUM ('AWAKE_EXAM', 'SEDATION_AT_PLACEMENT', 'UNDER_SEDATION');

-- AlterTable - Update examCondition column to use the enum type
ALTER TABLE "public"."Exam" ALTER COLUMN "examCondition" TYPE "public"."ExamCondition" USING ("examCondition"::text::"public"."ExamCondition");
