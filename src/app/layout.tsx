import Header from '@/components/header';
import TailwindIndicator from '@/components/tailwind-indicator';
import { ThemeProvider } from '@/components/theme-provider';
import TRPCProvider from '@/context/trpc-provider';
import { inter } from '@/styles/fonts';
import type { Metadata } from 'next';
import '../styles/globals.css';
import { Toaster } from '@/components/ui/toaster';
import * as React from 'react';
import { cn } from '@/lib/utils';

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
    <TRPCProvider>
      <html
        lang="en"
        className={cn(
          'scroll-smooth bg-neutral-900 font-sans text-slate-50 antialiased'
        )}
        suppressHydrationWarning
      >
        <head />
        <body className={` min-h-screen ${inter.className}`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="container max-w-[90rem] h-screen">
              <Header />
              {children}
            </div>
            <Toaster />
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </TRPCProvider>
  );
}
