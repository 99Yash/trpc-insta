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
        imgUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        auth: { userId },
      } = ctx;
      (await clerkClient.users.getUser(userId)).imageUrl;
    }),
  updateMetadata: protectedProcedure
    .input(userPublicMetadataSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        auth: { userId },
      } = ctx;
      const { username, bio } = input;
      return await clerkClient.users.updateUser(userId, {
        unsafeMetadata: {
          username,
          bio,
        },
      });
    }),
});
