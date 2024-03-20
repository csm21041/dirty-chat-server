/*
  Warnings:

  - You are about to drop the column `image_count` on the `Model` table. All the data in the column will be lost.
  - Added the required column `profile_images` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Model" DROP COLUMN "image_count",
ADD COLUMN     "profile_images" JSONB NOT NULL;
