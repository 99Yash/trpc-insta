import { userPublicMetadataSchema } from '@/lib/validators';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { clerkClient } from '@clerk/nextjs';
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
  updatePicture: protectedProcedure
    .input(
      z.object({
        image: z.any(),
        caption: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        auth: { userId },
      } = ctx;
    }),
  updateMetadata: protectedProcedure
    .input(userPublicMetadataSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        auth: { userId },
      } = ctx;
      const { username, bio } = input;
      await clerkClient.users.updateUser(userId, {
        unsafeMetadata: {
          bio,
        },
      });
      return await clerkClient.users.updateUser(userId, {
        username,
      });
    }),
});
