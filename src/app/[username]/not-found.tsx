import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404: User not found',
};

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">
        Sorry, this page isn&apos;t available.
      </h2>
      <p className="text-sm">The link you followed may be broken.</p>
      <Link href="/" className="text-blue-500">
        Go back home
      </Link>
    </div>
  );
}
