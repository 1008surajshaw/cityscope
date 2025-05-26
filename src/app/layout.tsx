import Header from '@/layouts/header';
import { cn } from '@/lib/utils';
import Providers from '@/providers/providers';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import localFont from 'next/font/local';

const satoshi = localFont({
  display: 'swap',
  src: [
    {
      path: '../../public/fonts/satoshi.ttf',
    },
  ],
  variable: '--font-satoshi',
});

export const metadata: Metadata = {
  title: 'cityscope',
  description: 'cityscope',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={cn(
          'font-satoshi antialiased bg-gradient-light dark:bg-gradient min-h-screen relative flex flex-col',
          satoshi.variable
        )}
      >
        <NextTopLoader color="blue" showSpinner={false} />
        <Providers>
          <Header />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 lg:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}