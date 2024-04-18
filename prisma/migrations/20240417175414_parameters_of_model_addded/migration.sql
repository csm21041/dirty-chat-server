/*
  Warnings:

  - You are about to drop the column `system_prompts` on the `Model` table. All the data in the column will be lost.
  - Added the required column `parameters` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Model" DROP COLUMN "system_prompts",
ADD COLUMN     "parameters" JSONB NOT NULL;
