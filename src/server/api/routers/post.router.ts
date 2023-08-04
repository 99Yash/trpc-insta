import { imageSchema } from '@/lib/validators';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
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
});
