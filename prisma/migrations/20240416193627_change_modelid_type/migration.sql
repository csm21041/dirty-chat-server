/*
  Warnings:

  - The primary key for the `Model` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_modelId_fkey";

-- AlterTable
ALTER TABLE "Messages" ALTER COLUMN "modelId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Model" DROP CONSTRAINT "Model_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Model_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Model_id_seq";

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE SET NULL ON UPDATE CASCADE;
