-- CreateEnum
CREATE TYPE "public"."ExamStaus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'ARCHIVED', 'CANCELLED');

-- DropEnum
DROP TYPE "public"."InvitationStatus";

-- CreateTable
CREATE TABLE "public"."Exam" (
    "id" TEXT NOT NULL,
    "status" "public"."ExamStaus" NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL,
    "vetReference" TEXT,
    "animalId" TEXT NOT NULL,
    "structureId" TEXT NOT NULL,
    "interpreterUserId" TEXT,
    "requestReason" TEXT,
    "history" TEXT,
    "clinicalExams" TEXT,
    "manifestationCategory" TEXT,
    "paroxysmalSubtype" TEXT,
    "manifestationOther" TEXT,
    "firstManifestationAt" TIMESTAMP(3),
    "lastManifestationAt" TIMESTAMP(3),
    "manifestationDescription" TEXT,
    "manifestationFrequency" TEXT,
    "avgManifestationDurationMin" INTEGER,
    "clinicalSuspicion" TEXT,
    "currentAntiepilepticTreatments" TEXT,
    "otherTreatments" TEXT,
    "examCondition" TEXT,
    "sedationProtocol" TEXT,
    "eegSpecificEvents" TEXT,
    "duringExamClinical" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExamAttachment" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT,
    "mimeType" TEXT,
    "kind" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExamAdditionalTest" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "findings" TEXT,

    CONSTRAINT "ExamAdditionalTest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Exam_animalId_idx" ON "public"."Exam"("animalId");

-- CreateIndex
CREATE INDEX "Exam_structureId_idx" ON "public"."Exam"("structureId");

-- CreateIndex
CREATE INDEX "Exam_requestedAt_idx" ON "public"."Exam"("requestedAt");

-- CreateIndex
CREATE INDEX "ExamAttachment_examId_kind_idx" ON "public"."ExamAttachment"("examId", "kind");

-- CreateIndex
CREATE INDEX "ExamAdditionalTest_examId_type_idx" ON "public"."ExamAdditionalTest"("examId", "type");

-- AddForeignKey
ALTER TABLE "public"."Exam" ADD CONSTRAINT "Exam_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "public"."Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Exam" ADD CONSTRAINT "Exam_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "public"."Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Exam" ADD CONSTRAINT "Exam_interpreterUserId_fkey" FOREIGN KEY ("interpreterUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExamAttachment" ADD CONSTRAINT "ExamAttachment_examId_fkey" FOREIGN KEY ("examId") REFERENCES "public"."Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExamAdditionalTest" ADD CONSTRAINT "ExamAdditionalTest_examId_fkey" FOREIGN KEY ("examId") REFERENCES "public"."Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
