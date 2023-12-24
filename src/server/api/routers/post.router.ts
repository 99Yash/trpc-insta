import { imageSchema } from '@/lib/validators';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
// import { utapi } from 'uploadthing/server';
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
              id: true,
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
  //? fetchAllOfCurrentUser, hence protectedProcedure
  fetchAll: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        images: true,
        likes: true,
        comments: true,
        // user: true,
      },
    });
    return posts ?? null;
  }),
  fetchPostCount: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const postAuthor = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });
      if (!postAuthor)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      if (postAuthor) {
        // Fetch posts associated with the postAuthor's ID
        const postCount = await ctx.prisma.post.count({
          where: {
            userId: postAuthor.id,
          },
        });
        return postCount;
      } else {
        return 0;
      }
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
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          images: {
            select: {
              url: true,
            },
            take: 1,
          },
        },
      });
      return posts;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
        include: {
          images: true,
        },
      });
      if (!post)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      if (post.userId !== ctx.session.user.id)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to delete this post',
        });
      const deletedPost = await ctx.prisma.post.delete({
        where: {
          id: input.postId,
        },
        include: {
          images: true,
        },
      });
      // await utapi.deleteFiles(deletedPost.images.map((image) => image.id));
      return deletedPost;
    }),
});
