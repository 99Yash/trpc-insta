'use client';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';
import React, { FC } from 'react';
import { Icons } from './icons';
import { Button } from './ui/button';

interface LoginButtonProps extends React.HTMLAttributes<HTMLDivElement> {}
const LoginButton: FC<LoginButtonProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn('google');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button
        aria-label="Sign in with Google"
        type="button"
        size="sm"
        disabled={isLoading}
        className="w-full"
        onClick={loginWithGoogle}
      >
        {isLoading ? (
          <Icons.spinner
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Icons.google className="h-4 w-4 mr-2" />
        )}
        Google
      </Button>
    </div>
  );
};

export default LoginButton;
