-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('VETERINARIAN', 'ADMIN', 'INTERPRETER');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roles" "public"."UserType"[] DEFAULT ARRAY[]::"public"."UserType"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Structure" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "address1" TEXT,
    "address2" TEXT,
    "zipcode" TEXT,
    "town" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "account_lastname" TEXT,
    "account_firstname" TEXT,
    "account_email" TEXT,
    "is_structure_active" BOOLEAN NOT NULL DEFAULT true,
    "interpreterId" TEXT,

    CONSTRAINT "Structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StructureUser" (
    "id" TEXT NOT NULL,
    "structureId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "StructureUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_externalId_key" ON "public"."User"("externalId");

-- AddForeignKey
ALTER TABLE "public"."Structure" ADD CONSTRAINT "Structure_interpreterId_fkey" FOREIGN KEY ("interpreterId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StructureUser" ADD CONSTRAINT "StructureUser_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "public"."Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StructureUser" ADD CONSTRAINT "StructureUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
