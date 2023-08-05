import { createTRPCRouter } from '@/server/api/trpc';
import { postRouter } from './routers/post.router';
import { userRouter } from './routers/user.router';
import { commentRouter } from './routers/comment.router';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  comment: commentRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
