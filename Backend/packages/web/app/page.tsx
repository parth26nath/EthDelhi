'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ConnectWallet } from '@/components/ConnectWallet';
import { WorldAppButton } from '@/components/WorldAppButton';

export default function HomePage() {
  const [showWorldApp, setShowWorldApp] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            HPV Warriors DAO
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Anonymous women's health forum with verified guardians
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="guardian-badge">Zero-Knowledge Privacy</span>
            <span className="guardian-badge">NFC Verification</span>
            <span className="guardian-badge">Decentralized Rewards</span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Join Anonymously
            </h3>
            <p className="text-gray-600 mb-4">
              Ask questions and share experiences without revealing your identity
            </p>
            <WorldAppButton />
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Connect Wallet
            </h3>
            <p className="text-gray-600 mb-4">
              Use any EVM wallet to participate in the community
            </p>
            <ConnectWallet />
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Become Guardian
            </h3>
            <p className="text-gray-600 mb-4">
              Verify your vaccination and moderate the community
            </p>
            <Link href="/verify" className="btn btn-guardian w-full">
              Start Verification
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Anonymous Posts</h3>
          <p className="text-gray-600 text-sm">Share sensitive health questions without fear</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-guardian-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-guardian-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Verified Guardians</h3>
          <p className="text-gray-600 text-sm">Trusted moderators proven via ZK + NFC</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Earn Rewards</h3>
          <p className="text-gray-600 text-sm">Get compensated for helpful contributions</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">On-Chain Impact</h3>
          <p className="text-gray-600 text-sm">Track community contributions transparently</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Explore the Community</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/forum" className="btn btn-primary">
            Browse Forum
          </Link>
          <Link href="/leaderboard" className="btn btn-secondary">
            View Leaderboard
          </Link>
          <Link href="/verify" className="btn btn-guardian">
            Become Guardian
          </Link>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="mt-16 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Demo Mode</h3>
            <p className="mt-1 text-sm text-yellow-700">
              This is a hackathon demo. Self Protocol and NFC features are mocked for demonstration purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}