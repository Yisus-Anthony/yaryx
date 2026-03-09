/*
  Warnings:

  - The values [NEW] on the enum `ProductCondition` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductCondition_new" AS ENUM ('Nuevo', 'USED', 'REFURBISHED');
ALTER TABLE "Product" ALTER COLUMN "condition" TYPE "ProductCondition_new" USING ("condition"::text::"ProductCondition_new");
ALTER TYPE "ProductCondition" RENAME TO "ProductCondition_old";
ALTER TYPE "ProductCondition_new" RENAME TO "ProductCondition";
DROP TYPE "ProductCondition_old";
COMMIT;
