import Header from '@/components/header';
import TailwindIndicator from '@/components/tailwind-indicator';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { TRPCReactProvider } from '@/trpc/react';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import * as React from 'react';
import '../styles/globals.css';

const dm_sans = Inter({
  display: 'swap',
  subsets: ['latin-ext', 'latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Trinsta',
    template: '%s • Trinsta.',
  },
  metadataBase: new URL('https://trpc-insta.vercel.app'),
  description:
    'Instagram Clone using the t3-stack: tRPC. Shadcn UI. Server Components',
  keywords: [
    'Instagram',
    'Clone',
    'Next js',
    't3 Stack',
    'App Router',
    'Tailwind CSS',
    'React',
    'Radix UI',
    'Next Auth',
    'Prisma',
    'Vercel',
    'TSX',
    'Typescript',
    'tRPC',
    'Server-Components',
    'Shadcn UI',
  ],
  twitter: {
    title: 'Trinsta',
    description:
      'A fully functional Instagram Clone using the t3 stack • Shadcn UI • Server Components in Next.js  ',
    creator: '@YashGouravKar1',
  },
  authors: {
    name: 'Yash Gourav Kar',
    url: 'https://github.com/99Yash',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Trinsta',
    description: 'Instagram with the best from the React ecosystem',
    url: 'https://trpc-insta.vercel.app',
    siteName: 'trpc-insta.vercel.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        'scroll-smooth bg-neutral-950 font-sans text-slate-50 antialiased'
      )}
    >
      <head>
        <Analytics />
      </head>
      <body className={cn(`min-h-screen ${dm_sans.className} `)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TailwindIndicator />
          <main className={cn('container sm:max-w-full h-screen')}>
            <TRPCReactProvider cookies={cookies().toString()}>
              <Header />
              {children}
            </TRPCReactProvider>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
