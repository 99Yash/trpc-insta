import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { z } from 'zod';

export const exampleRouter = createTRPCRouter({
  hello: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return {
        greeting: `hello to ${ctx.auth.user?.firstName} by ${input.name}`,
      };
    }),
});
