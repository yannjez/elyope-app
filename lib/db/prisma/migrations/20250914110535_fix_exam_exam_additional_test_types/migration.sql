/*
  Warnings:

  - Changed the type of `type` on the `ExamAdditionalTest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ExamAdditionalTestType" AS ENUM ('NFS', 'BIOCHEMISTRY', 'BILE_ACIDS_PRE_POST', 'MRI', 'LCS', 'OTHER');

-- AlterTable
ALTER TABLE "public"."ExamAdditionalTest" DROP COLUMN "type",
ADD COLUMN     "type" "public"."ExamAdditionalTestType" NOT NULL;

-- CreateIndex
CREATE INDEX "ExamAdditionalTest_examId_type_idx" ON "public"."ExamAdditionalTest"("examId", "type");
