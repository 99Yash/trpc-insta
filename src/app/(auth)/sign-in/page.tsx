import SignIn from '@/components/auth/signin';
import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/session';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FC } from 'react';

const SignInPage: FC = async () => {
  const user = await getCurrentUser();

  if (user) {
    return redirect('/');
  }
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'self-start -mt-20'
          )}
        >
          <Icons.left className="mr-2 h-4 w-4" />
          Home
        </Link>

        <SignIn />
      </div>
    </div>
  );
};

export default SignInPage;
