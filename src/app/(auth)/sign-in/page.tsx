import { buttonVariants } from '@/components/ui/button';
import OAuthSignIn from '@/components/auth/oauth-signin';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

const page: FC = () => {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20 ">
        <Link
          href={'/'}
          className={
            (cn(
              buttonVariants({
                variant: 'ghost',
              })
            ),
            'self-start -mt-20')
          }
        >
          <ChevronLeft className="inline " />
          Home
        </Link>
        <div className="container rounded-md p-8 mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] ">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-bold">Sign In</h1>
            <p className="text-sm max-w-xs mx-auto">
              Choose your preferred sign in method
            </p>
          </div>
          <OAuthSignIn />

          <p className="px-8 text-center text-sm ">
            Don&apos;t have an account?{' '}
            <Link
              aria-label="Sign up"
              href="/sign-up"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
