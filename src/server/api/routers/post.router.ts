import { imageSchema } from '@/lib/validators';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const postRouter = createTRPCRouter({
  addPost: protectedProcedure
    .input(
      z.object({
        caption: z.string().optional().default(''),
        images: z.array(imageSchema).max(3),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const requestingUser = ctx.session.user;
      if (!requestingUser)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User not authenticated',
        });
      const newPost = await ctx.prisma.post.create({
        data: {
          caption: input.caption,
          images: {
            create: input.images,
          },
          userId: ctx.session.user.id,
        },
        include: {
          images: true,
        },
      });
      return newPost;
    }),
  fetchPost: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const retrievedPost = await ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
        include: {
          comments: {
            include: {
              user: true,
            },
          },
          images: true,
          user: {
            select: {
              username: true,
              image: true,
              name: true,
            },
          },
          likes: true,
        },
      });
      return retrievedPost;
    }),
  fetchAll: protectedProcedure.query(async ({ ctx, input }) => {
    const posts = await ctx.prisma.post.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        images: true,
        likes: true,
        // comments: true,
      },
    });
    return posts;
  }),
});
