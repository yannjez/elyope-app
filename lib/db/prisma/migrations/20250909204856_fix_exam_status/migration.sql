/*
  Warnings:

  - Changed the type of `status` on the `Exam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ExamStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'ARCHIVED', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."Exam" DROP COLUMN "status",
ADD COLUMN     "status" "public"."ExamStatus" NOT NULL;

-- DropEnum
DROP TYPE "public"."ExamStaus";
