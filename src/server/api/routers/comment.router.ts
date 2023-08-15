import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const commentRouter = createTRPCRouter({
  addComment: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1),
        postId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const addedCmt = await ctx.prisma.comment.create({
        data: {
          text: input.text,
          postId: input.postId,
          likes: 0,
          userId: ctx.session.user.id,
        },
      });
      return addedCmt;
    }),
  fetchCommentsOfPost: publicProcedure
    .input(
      z.object({
        postId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          postId: input.postId,
        },
        include: {
          user: true,
        },
      });
      return comments;
    }),
});
