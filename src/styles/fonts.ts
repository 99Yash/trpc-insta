import { DM_Sans, Inter } from 'next/font/google';

export const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  subsets: [
    'latin-ext',
    'latin',
    'cyrillic',
    'cyrillic-ext',
    'greek',
    'greek-ext',
    'vietnamese',
  ],
});

export const dm_sans = DM_Sans({
  display: 'swap',
  subsets: ['latin-ext', 'latin'],
  weight: ['400', '500', '700'],
});
