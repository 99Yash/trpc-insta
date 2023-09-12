import { imageSchema } from '@/lib/validators';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
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
  getWithLikeCount: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
        include: {
          likes: {
            select: {
              userId: true,
            },
          },
        },
      });
      return post;
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
            orderBy: {
              createdAt: 'desc',
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
          likes: {
            select: {
              userId: true,
            },
          },
        },
      });
      return retrievedPost;
    }),
  fetchAll: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        images: true,
        likes: true,
        comments: true,
      },
    });
    return posts;
  }),
  fetchPostCount: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const postCount = await ctx.prisma.post.count({
        where: {
          userId: input.userId,
        },
      });
      return postCount;
    }),
  fetchAllOfUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          user: {
            username: input.username,
          },
        },
        include: {
          images: true,
          likes: true,
          comments: true,
        },
      });
      return posts;
    }),
});
