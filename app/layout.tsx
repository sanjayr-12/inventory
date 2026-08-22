import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Laxmi Textiles — Simple Real-Time Inventory & POS System',
  description: 'Visual inventory and counter checkout system built for Laxmi Textiles.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jakarta.className} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className={`${jakarta.className} min-h-full flex flex-col bg-[#fbf8f2] dark:bg-[#181512] text-[#1c1917] dark:text-[#fbf8f2] antialiased transition-colors`}>
        {children}
      </body>
    </html>
  );
}
