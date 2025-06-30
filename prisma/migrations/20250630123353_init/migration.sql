-- CreateTable
CREATE TABLE "Pet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VaccinationType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "interval" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "VaccinationRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "petId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "completedAt" DATETIME,
    CONSTRAINT "VaccinationRecord_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VaccinationRecord_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "VaccinationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "VaccinationType_name_key" ON "VaccinationType"("name");
