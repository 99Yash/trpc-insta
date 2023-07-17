'use client';

import { isClerkAPIResponseError, useSignIn } from '@clerk/nextjs';
import { OAuthStrategy } from '@clerk/nextjs/dist/types/server';
import React from 'react';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';

const OAuthSignIn = () => {
  const oauthProviders = [
    { name: 'Google', strategy: 'oauth_google', icon: 'google' },
    { name: 'Apple', strategy: 'oauth_apple', icon: 'apple' },
  ] satisfies {
    name: string;
    icon: keyof typeof Icons;
    strategy: OAuthStrategy;
  }[];
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null);

  async function oauthSignIn(provider: OAuthStrategy) {
    if (!signInLoaded) return null;
    try {
      setIsLoading(provider);
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
    } catch (error) {
      setIsLoading(null);
      const genericErr = 'Something went wrong, please try again.';

      isClerkAPIResponseError(error)
        ? toast({
            title: 'Error',
            description: error.errors[0]?.longMessage ?? genericErr,
            variant: 'destructive',
          })
        : toast({
            title: 'Error',
            description: genericErr,
            variant: 'destructive',
          });
    }
  }

  return (
    <div className={`grid grid-cols-1 gap-2 sm:grid-cols-${3} sm:gap-4`}>
      {oauthProviders.map((provider) => {
        const Icon = Icons[provider.icon];

        return (
          <Button
            aria-label={`Sign in with ${provider.name}`}
            key={provider.strategy}
            variant="outline"
            onClick={() => void oauthSignIn(provider.strategy)}
            className="w-full bg-background sm:w-auto"
            disabled={isLoading !== null}
          >
            {isLoading === provider.strategy ? (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {provider.name}
          </Button>
        );
      })}
    </div>
  );
};

export default OAuthSignIn;
