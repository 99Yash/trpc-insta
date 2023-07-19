'use client';

//@typescript-eslint/no-unsafe-assignment
import { inter } from '@/styles/fonts';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { Icons } from './icons';
import { UserButton } from './user-button';

const Header = () => {
  const { isSignedIn } = useAuth();
  return (
    <header className={`${inter.className} absolute z-30 w-full`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link
            href="/"
            className="mr-4 flex shrink-0 items-center justify-center gap-2"
          >
            <Icons.logo className="h-8 w-8 stroke-zinc-300 duration-500 hover:stroke-zinc-100 sm:h-6 sm:w-6" />
            <span className="inline stroke-zinc-300 font-semibold">
              Trinsta.
            </span>
          </Link>
          {/* Desktop navigation */}

          <nav className="flex grow">
            {/* Desktop sign in links */}
            <ul className="flex grow flex-wrap items-center justify-end">
              <li>
                {!isSignedIn ? (
                  <Link
                    className="text-sm font-medium text-zinc-300 duration-500 hover:text-white"
                    href="/sign-in"
                  >
                    Sign In
                  </Link>
                ) : (
                  <UserButton />
                )}
              </li>
            </ul>
          </nav>
        </div>
        {/* <hr className=" text-center" /> */}
      </div>
    </header>
  );
};

export default Header;