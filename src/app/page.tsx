'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api/api';
import { cn } from '@/lib/utils';
import { UserButton, useUser } from '@clerk/nextjs';
import { DM_Sans, Inter } from 'next/font/google';
import Link from 'next/link';

export const inter = Inter({
  display: 'swap',
  subsets: [
    'latin-ext',
    'latin',
    'cyrillic',
    'cyrillic-ext',
    'greek',
    'greek-ext',
    'vietnamese',
  ],
});

const Index = () => {
  const { isSignedIn, user } = useUser();
  const greeting = api.example.hello.useQuery({
    name: 'YGK',
  });
  return (
    <div className="flex items-center justify-center">
      <header className={`${inter.className} absolute z-30 w-full`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between md:h-20">
            <Link
              href="/"
              className="mr-4 flex shrink-0 items-center justify-center gap-2"
            >
              <Icons.logo className="h-8 w-8 stroke-zinc-300 duration-500 hover:stroke-zinc-100" />
              <span className="inline stroke-zinc-300 font-bold">Trinsta.</span>
            </Link>
            {/* Desktop navigation */}
            {!isSignedIn && !user ? (
              <nav className="flex grow">
                {/* Desktop sign in links */}
                <ul className="flex grow flex-wrap items-center justify-end">
                  <li>
                    <Link
                      className="text-sm font-medium text-zinc-300 duration-500 hover:text-white"
                      href="/sign-in"
                    >
                      Sign In
                    </Link>
                  </li>
                </ul>
              </nav>
            ) : (
              <UserButton />
            )}
          </div>
          {/* <hr className=" text-center" /> */}
        </div>
      </header>
      <Button className={cn('font-semibold')}>
        {greeting.data ? greeting.data.greeting : 'Loading tRPC query...'}{' '}
      </Button>
    </div>
  );
};

export default Index;
