import Header from '@/components/header';
import TailwindIndicator from '@/components/tailwind-indicator';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import TRPCProvider from '@/context/trpc-provider';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { inter } from '@/styles/fonts';
import { ToastProvider } from '@/components/toastProvider';
import '@uploadthing/react/styles.css';
import '../styles/globals.css';

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
    'Tailwind',
    'React',
    'Radix UI',
    'Clerk Auth',
    'Clerk.com',
    'Clerk.dev',
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
    <ClerkProvider>
      <TRPCProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={` min-h-screen antialiased ${inter.className}`}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <Header />
              <TailwindIndicator />
              <div className="container max-w-7xl pt-14 mx-auto h-full">
                <ToastProvider>{children}</ToastProvider>
              </div>
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </TRPCProvider>
    </ClerkProvider>
  );
}
