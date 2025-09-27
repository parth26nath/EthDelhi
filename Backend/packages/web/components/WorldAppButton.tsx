'use client';

import { useState } from 'react';

export function WorldAppButton() {
  const [showInfo, setShowInfo] = useState(false);

  const handleOpenWorldApp = () => {
    // Try to open World App deep link
    const deepLink = 'worldcoin://mini-app?url=' + encodeURIComponent(window.location.origin);

    // For demo purposes, just show info about World App integration
    window.open('https://worldcoin.org/download', '_blank');
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpenWorldApp}
        className="btn btn-primary w-full flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.5 8.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S6 10.83 6 10s.67-1.5 1.5-1.5zm9 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S15 10.83 15 10s.67-1.5 1.5-1.5zM12 17.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
        </svg>
        <span>Open in World App</span>
      </button>

      <button
        onClick={() => setShowInfo(!showInfo)}
        className="mt-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        What is World App?
      </button>

      {showInfo && (
        <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
          <div className="relative">
            <h4 className="font-semibold mb-1">World App Integration</h4>
            <p className="mb-2">
              World App provides identity verification for anonymous but verified participation.
            </p>
            <p className="text-gray-300">
              This demo opens the World App download page. In production, it would deep-link to the mini-app.
            </p>
            <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 transform rotate-45 mt-[-4px]"></div>
          </div>
        </div>
      )}
    </div>
  );
}