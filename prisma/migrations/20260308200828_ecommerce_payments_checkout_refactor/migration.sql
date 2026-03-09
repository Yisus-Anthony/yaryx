/*
  Warnings:

  - The values [CANCELED,EXPIRED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PAID,CANCELED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Nuevo] on the enum `ProductCondition` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `userId` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(191)`.
  - You are about to alter the column `name` on the `ContactMessage` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `email` on the `ContactMessage` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(191)`.
  - You are about to alter the column `subject` on the `ContactMessage` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to drop the column `paymentMethod` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `subtotalAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to alter the column `currency` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `customerEmail` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(191)`.
  - You are about to alter the column `customerName` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `customerPhone` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `reference` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `coverPublicId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to alter the column `productName` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `productSlug` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(160)`.
  - You are about to drop the column `checkoutUrl` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `externalId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `externalStatus` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `rawPayload` on the `Payment` table. All the data in the column will be lost.
  - The `method` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `currency` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `externalReference` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(191)`.
  - You are about to drop the column `createdAt` on the `PaymentWebhookEvent` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `PaymentWebhookEvent` table. All the data in the column will be lost.
  - You are about to drop the column `externalId` on the `PaymentWebhookEvent` table. All the data in the column will be lost.
  - You are about to drop the column `signatureValid` on the `PaymentWebhookEvent` table. All the data in the column will be lost.
  - You are about to alter the column `eventType` on the `PaymentWebhookEvent` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - You are about to alter the column `slug` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(160)`.
  - You are about to alter the column `name` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `folder` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `coverPublicId` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the `IdempotencyKey` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sessionId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idempotencyKey]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider,externalEventId]` on the table `PaymentWebhookEvent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderNumber` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productCategory` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productCondition` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productCoverPublicId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productFolder` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `eventType` on table `PaymentWebhookEvent` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `category` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('CONSOLES', 'GAMES', 'ACCESSORIES', 'COLLECTIBLES', 'COMPONENTS', 'OTHER');

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CONVERTED', 'ABANDONED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'DEBIT_CARD', 'CREDIT_CARD', 'CASH', 'BANK_TRANSFER', 'WALLET', 'CODI', 'PAYPAL', 'OTHER');

-- CreateEnum
CREATE TYPE "WebhookProcessingStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'IGNORED', 'FAILED');

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'AWAITING_PAYMENT', 'PAID', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'FAILED', 'REFUNDED');
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'REQUIRES_ACTION', 'AUTHORIZED', 'APPROVED', 'CAPTURED', 'FAILED', 'CANCELLED', 'EXPIRED', 'REFUNDED');
ALTER TABLE "Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "paymentStatus" TYPE "PaymentStatus_new" USING ("paymentStatus"::text::"PaymentStatus_new");
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProductCondition_new" AS ENUM ('NEW', 'USED', 'REFURBISHED');
ALTER TABLE "Product" ALTER COLUMN "condition" TYPE "ProductCondition_new" USING ("condition"::text::"ProductCondition_new");
ALTER TABLE "OrderItem" ALTER COLUMN "productCondition" TYPE "ProductCondition_new" USING ("productCondition"::text::"ProductCondition_new");
ALTER TYPE "ProductCondition" RENAME TO "ProductCondition_old";
ALTER TYPE "ProductCondition_new" RENAME TO "ProductCondition";
DROP TYPE "ProductCondition_old";
COMMIT;

-- DropIndex
DROP INDEX "Order_paymentMethod_idx";

-- DropIndex
DROP INDEX "Order_reference_idx";

-- DropIndex
DROP INDEX "Payment_externalId_idx";

-- DropIndex
DROP INDEX "Payment_provider_externalId_key";

-- DropIndex
DROP INDEX "Payment_provider_externalReference_key";

-- DropIndex
DROP INDEX "PaymentWebhookEvent_createdAt_idx";

-- DropIndex
DROP INDEX "PaymentWebhookEvent_eventId_idx";

-- DropIndex
DROP INDEX "PaymentWebhookEvent_externalId_idx";

-- DropIndex
DROP INDEX "PaymentWebhookEvent_provider_eventId_key";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "sessionId" VARCHAR(191),
ADD COLUMN     "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "userId" SET DATA TYPE VARCHAR(191);

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "unitPrice" INTEGER;

-- AlterTable
ALTER TABLE "ContactMessage" ALTER COLUMN "name" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(191),
ALTER COLUMN "subject" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentMethod",
DROP COLUMN "subtotalAmount",
ADD COLUMN     "billingAddress" JSONB,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "discountAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "failedAt" TIMESTAMP(3),
ADD COLUMN     "orderNumber" VARCHAR(50) NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "placedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "shippingAddress" JSONB,
ADD COLUMN     "shippingAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subtotal" INTEGER NOT NULL,
ADD COLUMN     "taxAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalItems" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userId" VARCHAR(191),
ALTER COLUMN "currency" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "customerEmail" SET DATA TYPE VARCHAR(191),
ALTER COLUMN "customerName" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "customerPhone" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "reference" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "coverPublicId",
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "productCategory" "ProductCategory" NOT NULL,
ADD COLUMN     "productCondition" "ProductCondition" NOT NULL,
ADD COLUMN     "productCoverPublicId" VARCHAR(255) NOT NULL,
ADD COLUMN     "productFolder" VARCHAR(255) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "productName" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "productSlug" SET DATA TYPE VARCHAR(160);

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "checkoutUrl",
DROP COLUMN "externalId",
DROP COLUMN "externalStatus",
DROP COLUMN "paidAt",
DROP COLUMN "rawPayload",
ADD COLUMN     "approvalUrl" TEXT,
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "capturedAt" TIMESTAMP(3),
ADD COLUMN     "checkoutSessionId" VARCHAR(191),
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "externalOrderId" VARCHAR(191),
ADD COLUMN     "externalPaymentId" VARCHAR(191),
ADD COLUMN     "failedAt" TIMESTAMP(3),
ADD COLUMN     "idempotencyKey" VARCHAR(191),
ADD COLUMN     "providerStatus" VARCHAR(100),
ADD COLUMN     "refundedAt" TIMESTAMP(3),
ADD COLUMN     "requestPayload" JSONB,
ADD COLUMN     "responsePayload" JSONB,
DROP COLUMN "method",
ADD COLUMN     "method" "PaymentMethod",
ALTER COLUMN "currency" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "externalReference" SET DATA TYPE VARCHAR(191);

-- AlterTable
ALTER TABLE "PaymentWebhookEvent" DROP COLUMN "createdAt",
DROP COLUMN "eventId",
DROP COLUMN "externalId",
DROP COLUMN "signatureValid",
ADD COLUMN     "externalEventId" VARCHAR(191),
ADD COLUMN     "headers" JSONB,
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "processingError" TEXT,
ADD COLUMN     "processingStatus" "WebhookProcessingStatus" NOT NULL DEFAULT 'RECEIVED',
ADD COLUMN     "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "signature" TEXT,
ALTER COLUMN "eventType" SET NOT NULL,
ALTER COLUMN "eventType" SET DATA TYPE VARCHAR(120);

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(160),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "folder" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "coverPublicId" SET DATA TYPE VARCHAR(255),
DROP COLUMN "category",
ADD COLUMN     "category" "ProductCategory" NOT NULL;

-- DropTable
DROP TABLE "IdempotencyKey";

-- CreateIndex
CREATE UNIQUE INDEX "Cart_sessionId_key" ON "Cart"("sessionId");

-- CreateIndex
CREATE INDEX "Cart_status_idx" ON "Cart"("status");

-- CreateIndex
CREATE INDEX "Cart_createdAt_idx" ON "Cart"("createdAt");

-- CreateIndex
CREATE INDEX "Cart_expiresAt_idx" ON "Cart"("expiresAt");

-- CreateIndex
CREATE INDEX "CartItem_createdAt_idx" ON "CartItem"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_paymentStatus_idx" ON "Order"("paymentStatus");

-- CreateIndex
CREATE INDEX "Order_placedAt_idx" ON "Order"("placedAt");

-- CreateIndex
CREATE INDEX "OrderItem_productSlug_idx" ON "OrderItem"("productSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_idempotencyKey_key" ON "Payment"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Payment_method_idx" ON "Payment"("method");

-- CreateIndex
CREATE INDEX "Payment_externalPaymentId_idx" ON "Payment"("externalPaymentId");

-- CreateIndex
CREATE INDEX "Payment_externalOrderId_idx" ON "Payment"("externalOrderId");

-- CreateIndex
CREATE INDEX "Payment_checkoutSessionId_idx" ON "Payment"("checkoutSessionId");

-- CreateIndex
CREATE INDEX "PaymentWebhookEvent_processingStatus_idx" ON "PaymentWebhookEvent"("processingStatus");

-- CreateIndex
CREATE INDEX "PaymentWebhookEvent_orderId_idx" ON "PaymentWebhookEvent"("orderId");

-- CreateIndex
CREATE INDEX "PaymentWebhookEvent_paymentId_idx" ON "PaymentWebhookEvent"("paymentId");

-- CreateIndex
CREATE INDEX "PaymentWebhookEvent_receivedAt_idx" ON "PaymentWebhookEvent"("receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentWebhookEvent_provider_externalEventId_key" ON "PaymentWebhookEvent"("provider", "externalEventId");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");

-- AddForeignKey
ALTER TABLE "PaymentWebhookEvent" ADD CONSTRAINT "PaymentWebhookEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentWebhookEvent" ADD CONSTRAINT "PaymentWebhookEvent_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
