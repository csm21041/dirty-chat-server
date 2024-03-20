/*
  Warnings:

  - You are about to drop the column `adminId` on the `Model` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_adminId_fkey";

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "adminId";
