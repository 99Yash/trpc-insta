import { PrismaClient } from '@prisma/client';
import { env } from '../env.mjs';
import { withAccelerate } from '@prisma/extension-accelerate';

const createAcceleratedPrismaClient = () => {
  return new PrismaClient().$extends(withAccelerate());
};

export type PrismaClientAccelerated = ReturnType<
  typeof createAcceleratedPrismaClient
>;

const globalForPrisma = globalThis as unknown as {
  acceleratedPrisma: PrismaClientAccelerated | undefined;
};

const acceleratedDb =
  globalForPrisma.acceleratedPrisma ?? createAcceleratedPrismaClient();

if (env.NODE_ENV !== 'production') {
  globalForPrisma.acceleratedPrisma = acceleratedDb;
}
export const prisma = acceleratedDb;
