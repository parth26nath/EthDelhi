import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navigation } from '@/components/Navigation';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'HPV Warriors DAO',
  description: 'Anonymous women\'s health forum with verified guardians',
  keywords: ['health', 'women', 'HPV', 'vaccination', 'anonymous', 'forum'],
  openGraph: {
    title: 'HPV Warriors DAO',
    description: 'Anonymous women\'s health forum with verified guardians',
    type: 'website',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="world-app-compat bg-gray-50 min-h-screen">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-white border-t border-gray-200 py-6">
              <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
                <p>HPV Warriors DAO - Empowering women's health through privacy and verification</p>
                <p className="mt-2">Built with Self Protocol, World App, and The Graph</p>
              </div>
            </footer>
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}