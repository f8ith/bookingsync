/*
  Warnings:

  - You are about to drop the column `isActive` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `isVisible` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `endDatetime` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `startDatetime` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `is_active` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_visible` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_datetime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_datetime` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "is_visible" BOOLEAN NOT NULL,
    "duration" INTEGER NOT NULL
);
INSERT INTO "new_Service" ("currency", "duration", "id", "name", "price") SELECT "currency", "duration", "id", "name", "price" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "start_datetime" DATETIME NOT NULL,
    "end_datetime" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "client_id" INTEGER NOT NULL,
    CONSTRAINT "Booking_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("code", "duration", "id") SELECT "code", "duration", "id" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
