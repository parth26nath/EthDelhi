'use client';

import { useState, useEffect } from 'react';
import { LeaderboardEntry, formatAddress, formatEther } from '@/lib/types';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'upvotes' | 'posts' | 'rewards'>('upvotes');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    switch (sortBy) {
      case 'upvotes':
        return b.upvotes - a.upvotes;
      case 'posts':
        return b.posts - a.posts;
      case 'rewards':
        return Number(b.rewards - a.rewards);
      default:
        return 0;
    }
  });

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `#${index + 1}`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Community Leaderboard
        </h1>
        <p className="text-lg text-gray-600">
          Celebrating our most active and helpful community members
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {leaderboard.reduce((sum, entry) => sum + entry.posts, 0)}
          </div>
          <p className="text-gray-600">Total Posts</p>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-guardian-600 mb-2">
            {leaderboard.reduce((sum, entry) => sum + entry.upvotes, 0)}
          </div>
          <p className="text-gray-600">Total Upvotes</p>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {formatEther(leaderboard.reduce((sum, entry) => sum + entry.rewards, 0n))} ETH
          </div>
          <p className="text-gray-600">Total Rewards</p>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <span className="text-sm text-gray-600 self-center">Sort by:</span>
        <button
          onClick={() => setSortBy('upvotes')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            sortBy === 'upvotes'
              ? 'bg-guardian-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Upvotes
        </button>
        <button
          onClick={() => setSortBy('posts')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            sortBy === 'posts'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setSortBy('rewards')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            sortBy === 'rewards'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Rewards
        </button>
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      ) : sortedLeaderboard.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Activity Yet
          </h3>
          <p className="text-gray-600">
            Start contributing to the community to appear on the leaderboard!
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upvotes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rewards
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedLeaderboard.map((entry, index) => (
                  <tr key={entry.wallet} className={index < 3 ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getRankIcon(index)}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-bold">
                            {entry.wallet.slice(2, 4).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatAddress(entry.wallet)}
                          </div>
                          {/* This would check if the wallet is a guardian */}
                          <span className="guardian-badge">Guardian</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.posts}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.upvotes}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatEther(entry.rewards)} ETH
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Impact Stats */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Community Impact
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Guardians</span>
              <span className="font-medium">
                {leaderboard.filter(entry => entry.posts > 0).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Posts per Guardian</span>
              <span className="font-medium">
                {leaderboard.length > 0
                  ? Math.round(leaderboard.reduce((sum, entry) => sum + entry.posts, 0) / leaderboard.length)
                  : 0
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Community Engagement</span>
              <span className="font-medium">
                {leaderboard.reduce((sum, entry) => sum + entry.upvotes + entry.posts, 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rewards Distribution
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Top Contributor Reward</span>
              <span className="font-medium">
                {sortedLeaderboard.length > 0
                  ? formatEther(sortedLeaderboard[0]?.rewards || 0n)
                  : '0'
                } ETH
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Reward</span>
              <span className="font-medium">
                {leaderboard.length > 0
                  ? formatEther(leaderboard.reduce((sum, entry) => sum + entry.rewards, 0n) / BigInt(leaderboard.length))
                  : '0'
                } ETH
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guardians with Rewards</span>
              <span className="font-medium">
                {leaderboard.filter(entry => entry.rewards > 0n).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}