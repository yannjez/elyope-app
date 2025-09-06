/*
  Warnings:

  - Added the required column `structureId` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Animal" ADD COLUMN     "structureId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Animal_structureId_idx" ON "public"."Animal"("structureId");

-- CreateIndex
CREATE INDEX "Animal_species_idx" ON "public"."Animal"("species");

-- CreateIndex
CREATE INDEX "Structure_interpreterId_idx" ON "public"."Structure"("interpreterId");

-- CreateIndex
CREATE INDEX "StructureUser_structureId_userId_idx" ON "public"."StructureUser"("structureId", "userId");

-- CreateIndex
CREATE INDEX "UserInvitation_userId_idx" ON "public"."UserInvitation"("userId");

-- AddForeignKey
ALTER TABLE "public"."Animal" ADD CONSTRAINT "Animal_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "public"."Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
