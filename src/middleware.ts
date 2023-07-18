import { clerkClient } from '@clerk/nextjs';
import { authMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { PublicMetadata } from './lib/validators';

export default authMiddleware({
  // Public routes are routes that don't require authentication
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/sso-callback(.*)',
    '/api/trpc(.*)',
  ],
  async afterAuth(auth, req) {
    if (auth.isPublicRoute) {
      //  For public routes, we don't need to do anything
      return NextResponse.next();
    }
    const url = new URL(req.nextUrl.origin);

    if (!auth.userId) {
      // if user tries to access protected route, redirect to sign in
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }

    const user = await clerkClient.users.getUser(auth.userId);

    if (!user) {
      throw new Error('User not found.');
    }

    // If the user doesn't have a username, set something default
    if (!user.unsafeMetadata.username) {
      console.log('mid');
      await clerkClient.users.updateUser(auth.userId, {
        unsafeMetadata: {
          username: (
            (user.firstName ? user.firstName : '') +
            (user.lastName ? user.lastName : '') +
            user.id.substring(5, 8) +
            Math.floor(Math.random() * 100).toString()
          )
            .trim()
            .replace(/\s/g, '')
            .toLowerCase() satisfies PublicMetadata,
        },
      });
    }
  },
});

export const config = {
  matcher: ['/((?!_next|_static|_vercel|[\\w-]+\\.\\w+).*)'],
};
