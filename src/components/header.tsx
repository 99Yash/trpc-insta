import { getSession } from '@/lib/session';
import { inter } from '@/styles/fonts';
import Link from 'next/link';
import { Icons } from './icons';
import SearchBar from './search-bar';
import { UserButton } from './user-nav';

const Header = async () => {
  const session = await getSession();

  return (
    <header className={`${inter.className} sticky z-30`}>
      <div className="mx-auto max-w-full px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link
            href="/"
            className="mr-4 flex shrink-0 items-center justify-center gap-2"
          >
            <Icons.logo className="h-8 w-8 stroke-zinc-300 duration-300 hover:stroke-zinc-100 sm:h-6 sm:w-6" />
            <span className="md:inline hidden stroke-zinc-300 font-semibold tracking-tight ">
              Trinsta.
            </span>
          </Link>

          <div className="flex md:hidden justify-end">
            <SearchBar />
            {!session?.user ? (
              <Link
                className="text-sm font-medium text-zinc-300 duration-500 hover:text-white"
                href="/sign-in"
              >
                Sign In
              </Link>
            ) : (
              <UserButton user={session.user} />
            )}
          </div>

          {/* Desktop navigation */}
          <nav className="md:flex hidden grow">
            {/* Desktop sign in links */}
            <ul className="flex grow flex-wrap items-center justify-end gap-4">
              <SearchBar />
              <li>
                {!session?.user ? (
                  <Link
                    className="text-sm font-medium text-zinc-300 duration-500 hover:text-white"
                    href="/sign-in"
                  >
                    Sign In
                  </Link>
                ) : (
                  <UserButton user={session.user} />
                )}
              </li>
            </ul>
          </nav>
        </div>
        <hr className="border-0 md:hidden block h-px mb-2 bg-slate-700" />
      </div>
    </header>
  );
};

export default Header;
