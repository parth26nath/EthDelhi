'use client';

import { useState } from 'react';
import Link from 'next/link';
// import { useAccount } from 'wagmi'; // Removed for demo
import { ConnectWallet } from './ConnectWallet';

export function Navigation() {
  // const { isConnected } = useAccount(); // Removed for demo
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Forum', href: '/forum' },
    { name: 'Verify', href: '/verify' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Admin', href: '/admin' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex">
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-primary-600">
                HPV Warriors DAO
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 transition-colors hover:text-primary-600"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop wallet connection */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <ConnectWallet />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 pl-3 pr-4 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-3">
              <ConnectWallet />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}