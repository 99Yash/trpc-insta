import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const likesRouter = createTRPCRouter({
  addLike: protectedProcedure
    .input(
      z.object({
        postId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const likingUser = ctx.session.user;
      if (!likingUser)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        });
      const isLiked = await ctx.prisma.like.findUnique({
        where: {
          postId_userId: {
            postId: input.postId,
            userId: ctx.session.user.id,
          },
        },
      });
      if (isLiked) {
        await ctx.prisma.like.delete({
          where: {
            postId_userId: {
              postId: input.postId,
              userId: ctx.session.user.id,
            },
          },
        });
        return isLiked;
      }
      const addedLike = await ctx.prisma.like.create({
        data: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
      return addedLike;
    }),
});
