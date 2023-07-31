import {
  addPostSchema,
  imageSchema,
  userProfileSchema,
} from '@/lib/validators';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
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
        greeting: `hello to ${ctx.session.user?.name} by ${input.name}`,
      };
    }),
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
