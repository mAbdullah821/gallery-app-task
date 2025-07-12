-- DropIndex
DROP INDEX "Image_updatedAt_idx";

-- CreateIndex
CREATE INDEX "Image_createdAt_idx" ON "Image"("createdAt");
