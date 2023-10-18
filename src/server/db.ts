import {
  Prisma,
  PrismaClient as PrismaClientWithoutExtension,
} from '@prisma/client';

import { env } from '@/env.mjs';
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientWithoutExtension | undefined;
};

const prismaOptions: Prisma.PrismaClientOptions = {};

const prismaClientWithoutExtensions = new PrismaClientWithoutExtension(
  prismaOptions
);

const prismaWithClientExtensions = prismaClientWithoutExtensions.$extends(
  withAccelerate()
);

export const prisma =
  ((globalThis as any).prisma as typeof prismaWithClientExtensions) ||
  prismaWithClientExtensions;

if (env.NODE_ENV !== 'production') (globalForPrisma as any).prisma = prisma;
