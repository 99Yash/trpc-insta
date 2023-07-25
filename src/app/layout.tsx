import Header from '@/components/header';
import TailwindIndicator from '@/components/tailwind-indicator';
import { ThemeProvider } from '@/components/theme-provider';
import TRPCProvider from '@/context/trpc-provider';
import { inter } from '@/styles/fonts';
import type { Metadata } from 'next';
import '../styles/globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: {
    default: 'Trinsta',
    template: '%s | Trinsta',
  },
  metadataBase: new URL('https://trpc-insta.vercel.app'),
  description:
    'Instagram Clone using the t3-stack: tRPC. Shadcn UI. Server Components',
  keywords: [
    'Instagram',
    'Clone',
    'Next js',
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
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={` min-h-screen antialiased ${inter.className}`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Header />
            <div className="container max-w-7xl mx-auto h-full">{children}</div>
            <Toaster />
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </TRPCProvider>
  );
}
