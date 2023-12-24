'use client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Error',
  description: 'An error occurred',
};

export default function Error({ error }: { readonly error: Error }) {
  console.error(error);

  return (
    <div className="mx-auto max-w-lg min-h-screen flex flex-col place-content-center place-items-center gap-8 px-8 py-16 lg:px-6 lg:py-0">
      <h1 className="text-[9rem] font-black leading-none md:text-[12rem]">
        500
      </h1>
      <h2 className="text-[2rem] md:text-[3rem]">Error.</h2>
      <h4 className="text-[0.83rem] md:text-[1rem]">{error.message}</h4>
    </div>
  );
}
