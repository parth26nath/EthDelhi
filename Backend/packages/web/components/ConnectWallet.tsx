'use client';

import { useState } from 'react';
import { formatAddress } from '@/lib/utils';

export function ConnectWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleConnect = async (walletName: string) => {
    setIsLoading(true);
    setShowDropdown(false);

    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setAddress('0x1234567890abcdef1234567890abcdef12345678');
      setIsLoading(false);
    }, 1000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress('');
    setShowDropdown(false);
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {address.slice(2, 4).toUpperCase()}
            </span>
          </div>
          <span>{formatAddress(address)}</span>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="py-1">
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                <div className="font-medium">Connected</div>
                <div className="text-gray-500">{formatAddress(address)}</div>
              </div>
              <button
                onClick={handleDisconnect}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isLoading}
        className="btn btn-primary flex items-center space-x-2"
      >
        {isLoading && <div className="loading-spinner"></div>}
        <span>Connect Wallet</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
              <div className="font-medium">Choose a wallet</div>
            </div>
            {['MetaMask', 'WalletConnect', 'Coinbase Wallet'].map((walletName) => (
              <button
                key={walletName}
                onClick={() => handleConnect(walletName)}
                disabled={isLoading}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">
                    {walletName.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <span>{walletName}</span>
              </button>
            ))}
            <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
              <div>Demo mode: Mock wallet connection for testing.</div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}