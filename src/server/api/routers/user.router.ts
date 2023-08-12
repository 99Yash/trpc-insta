import { userProfileSchema } from '@/lib/validators';
import { protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter } from '../trpc';

export const userRouter = createTRPCRouter({
  fetchUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const retrievedUser = await ctx.prisma.user.findUnique({
        where: { username: input.username },
      });
      return retrievedUser;
    }),
  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const retrievedUsers = await ctx.prisma.user.findMany({
      where: {
        OR: [
          { name: { startsWith: input } },
          { username: { startsWith: input } },
        ],
      },
      select: { username: true, name: true, id: true },
      take: 5,
      //todo: maybe sort by desc followers
    });
    return retrievedUsers ?? [];
  }),
  updateUserProfile: protectedProcedure
    .input(userProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const requestingUser = ctx.session.user;
      if (!requestingUser)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User not authenticated',
        });
      const userToUpdate = await ctx.prisma.user.findUnique({
        where: { id: requestingUser.id },
      });
      if (!userToUpdate)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      const updatedUser = await ctx.prisma.user.update({
        where: { id: requestingUser.id },
        data: {
          username: input.username,
          bio: input.bio,
          name: input.name,
        },
      });
      return updatedUser;
    }),
});
