'use client';

import { Button } from '@/components/ui/button';
import { api } from '@/lib/api/api';
import { cn } from '@/lib/utils';
import { SignIn, UserButton } from '@clerk/nextjs';

const page = () => {
  const greeting = api.example.hello.useQuery({
    name: 'YGK',
  });
  return (
    <div className="flex items-center justify-center">
      <UserButton />
      <SignIn />
      <Button className={cn('font-semibold')}>
        {greeting.data ? greeting.data.greeting : 'Loading tRPC query...'}{' '}
      </Button>
    </div>
  );
};

export default page;
