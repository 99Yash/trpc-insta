import { imageSchema, userProfileSchema } from '@/lib/validators';
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
        select: {
          bio: true,
          id: true,
          image: true,
          name: true,
          username: true,
        },
      });
      if (!retrievedUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }
      return retrievedUser;
    }),
  fetchCurrentUser: publicProcedure.query(async ({ ctx }) => {
    const retrievedUser = await ctx.prisma.user.findUnique({
      where: { id: ctx.session?.user?.id },
    });
    if (!retrievedUser) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }
    return retrievedUser;
  }),
  search: publicProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const retrievedUsers = await ctx.prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: input } },
            { username: { contains: input } },
          ],
        },
        select: { username: true, name: true, id: true },
        take: 5,
        //todo: maybe sort by desc followers
      });
      return retrievedUsers ?? [];
    }),
  followOrUnfollow: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id === input.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You cannot follow yourself',
        });
      }
      const userToFollow = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });
      if (!userToFollow) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }
      const requestingUser = ctx.session.user;
      if (!requestingUser)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User not authenticated',
        });
      const alreadyFollowing = await ctx.prisma.followers.findFirst({
        where: {
          followerId: requestingUser.id,
          followingId: userToFollow.id,
        },
      });
      if (alreadyFollowing) {
        await ctx.prisma.followers.delete({
          where: {
            followerId: requestingUser.id,
            followingId: userToFollow.id,
          },
        });
      } else {
        await ctx.prisma.followers.create({
          data: {
            followerId: requestingUser.id,
            followingId: userToFollow.id,
          },
        });
      }
    }),
  fetchFollowerCountByUserId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const retrievedFollowerCount = await ctx.prisma.followers.count({
        where: { followingId: input.id },
      });
      return retrievedFollowerCount;
    }),
  fetchFollowerIds: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const retrievedFollowerIds = await ctx.prisma.followers.findMany({
        where: { followingId: input.id },
        select: { followerId: true },
      });
      return retrievedFollowerIds;
    }),
  fetchFollowerCount: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const retrievedFollowerCount = await ctx.prisma.followers.count({
        where: { followingId: input.userId },
      });
      return retrievedFollowerCount;
    }),
  fetchFollowingCount: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const retrievedFollowingCount = await ctx.prisma.followers.count({
        where: { followerId: input.userId },
      });
      return retrievedFollowingCount;
    }),
  changeProfilePic: protectedProcedure
    .input(imageSchema)
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
      if (userToUpdate.id !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized for this operation.',
        });
      }
      const updatedUser = await ctx.prisma.user.update({
        where: { id: requestingUser.id },
        data: {
          image: input.url,
        },
      });
      return updatedUser;
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
      if (userToUpdate.id !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        });
      }
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
