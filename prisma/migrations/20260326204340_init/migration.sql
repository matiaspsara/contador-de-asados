/*
  Warnings:

  - You are about to drop the column `corte` on the `Asado` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Asado" DROP COLUMN "corte",
ADD COLUMN     "cortes" TEXT[];
