/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[zsdfdfsd]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "deviceId" TEXT,
ADD COLUMN     "zsdfdfsd" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_deviceId_key" ON "public"."User"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "User_zsdfdfsd_key" ON "public"."User"("zsdfdfsd");
