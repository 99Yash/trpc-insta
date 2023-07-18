'use client';
import { api } from '@/lib/api/api';
import { SignedIn } from '@clerk/nextjs';

const Index = () => {
  const greeting = api.example.hello.useQuery({
    name: 'YGK',
  });
  return (
    <div className="flex h-screen flex-col gap-3 items-center justify-center">
      <SignedIn>
        <h1 className="text-6xl font-bold text-pink-700 animate-in fade-in-5">
          Welcome to Trinstagram.
        </h1>
        <p>Follow users to see their posts. OR create one yourself </p>
        <p>
          {greeting.data ? greeting.data.greeting : 'Loading tRPC query...'}
        </p>
      </SignedIn>
    </div>
  );
};

export default Index;
