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
  getLikedUsers: protectedProcedure
    .input(
      z.object({
        postId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const likes = await ctx.prisma.like.findMany({
        where: {
          postId: input.postId,
        },
        include: {
          user: {
            select: {
              image: true,
              username: true,
            },
          },
        },
      });
      return likes;
    }),
  getLikesCount: protectedProcedure
    .input(
      z.object({
        postId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const likesCount = await ctx.prisma.like.findMany({
        where: {
          postId: input.postId,
        },
        select: {
          userId: true,
        },
      });
      return likesCount;
    }),
});
