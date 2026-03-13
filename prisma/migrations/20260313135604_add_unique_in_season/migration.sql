/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Season` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Season_name_key" ON "Season"("name");
