-- CreateTable
CREATE TABLE "DrawingElement" (
    "id" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "radius" DOUBLE PRECISION,
    "path" TEXT,
    "text" TEXT,
    "strokeColor" TEXT NOT NULL DEFAULT '#000000',
    "fillColor" TEXT,
    "strokeWidth" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "opacity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DrawingElement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DrawingElement" ADD CONSTRAINT "DrawingElement_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
