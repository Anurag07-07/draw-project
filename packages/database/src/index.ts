import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.$connect();
    console.log("Connected to database");
  } catch (error) {
    console.error("Prisma connection error:", error);
  }
})();
