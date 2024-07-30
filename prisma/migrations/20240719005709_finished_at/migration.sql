/*
  Warnings:

  - You are about to drop the column `concluted_at` on the `Target` table. All the data in the column will be lost.
  - Added the required column `finished_at` to the `Target` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Target" DROP COLUMN "concluted_at",
ADD COLUMN     "finished_at" TIMESTAMP(3) NOT NULL;
