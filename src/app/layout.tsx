import TRPCProvider from '@/context/trpc-provider';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';
import TailwindIndicator from '@/components/tailwind-indicator';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TRINSTA',
  description: 'Instagram: t3-stack. Shadcn UI. Server Components',
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
              {children}
              <TailwindIndicator />
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </TRPCProvider>
    </ClerkProvider>
  );
}
