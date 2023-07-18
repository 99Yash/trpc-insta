import Header from '@/components/header';
import TailwindIndicator from '@/components/tailwind-indicator';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import TRPCProvider from '@/context/trpc-provider';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import '../styles/globals.css';
import { inter } from '@/styles/fonts';

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
              <Header />
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
