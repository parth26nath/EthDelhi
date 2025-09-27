'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Post, formatAddress } from '@/lib/types';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: Post & { isGuardianPost?: boolean; upvotes?: number };
  onUpvote: () => void;
}

export function PostCard({ post, onUpvote }: PostCardProps) {
  const { address, isConnected } = useAccount();
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet to upvote');
      return;
    }

    if (hasUpvoted) {
      toast.error('You have already upvoted this post');
      return;
    }

    try {
      setIsUpvoting(true);

      const response = await fetch(`/api/posts/${post.id}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voter: address }),
      });

      if (response.ok) {
        toast.success('Post upvoted!');
        setHasUpvoted(true);
        onUpvote();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to upvote');
      }
    } catch (error) {
      console.error('Upvote failed:', error);
      toast.error('Failed to upvote post');
    } finally {
      setIsUpvoting(false);
    }
  };

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  return (
    <div className="card p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {post.author.slice(2, 4).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">
                {formatAddress(post.author)}
              </span>
              {post.isGuardianPost && (
                <span className="guardian-badge">
                  Verified Guardian
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
          </div>
        </div>

        {/* Anonymous badge */}
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Anonymous
        </span>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {post.title}
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {post.body}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleUpvote}
            disabled={isUpvoting || hasUpvoted || post.author === address}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              hasUpvoted || post.author === address
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {isUpvoting ? (
              <div className="loading-spinner w-4 h-4"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            )}
            <span>{post.upvotes || 0}</span>
          </button>

          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Reply</span>
          </button>

          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>Share</span>
          </button>
        </div>

        {/* Privacy indicator */}
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Private</span>
        </div>
      </div>

      {/* Interaction hints */}
      {post.author === address && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
          This is your post. You cannot upvote your own content.
        </div>
      )}

      {hasUpvoted && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
          ✅ You have upvoted this post. Thanks for your support!
        </div>
      )}
    </div>
  );
}