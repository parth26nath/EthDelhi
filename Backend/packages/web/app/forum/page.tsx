'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Post } from '@/lib/types';
import { PostCard } from '@/components/PostCard';
import { CreatePostModal } from '@/components/CreatePostModal';
import { ConnectWallet } from '@/components/ConnectWallet';

export default function ForumPage() {
  const { isConnected } = useAccount();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'guardians'>('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleUpvote = async (postId: string) => {
    try {
      // This would call the smart contract upvote function
      const response = await fetch(`/api/posts/${postId}/upvote`, {
        method: 'POST',
      });

      if (response.ok) {
        // Update local state
        setPosts(prev => prev.map(post =>
          post.id === postId
            ? { ...post, upvotes: (post.upvotes || 0) + 1 }
            : post
        ));
      }
    } catch (error) {
      console.error('Failed to upvote post:', error);
    }
  };

  const filteredPosts = filter === 'guardians'
    ? posts.filter(post => post.isGuardianPost)
    : posts;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Community Forum
          </h1>
          <p className="text-gray-600">
            Ask questions, share experiences, and support each other
          </p>
        </div>

        {isConnected ? (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary mt-4 sm:mt-0"
          >
            Create Post
          </button>
        ) : (
          <div className="mt-4 sm:mt-0">
            <ConnectWallet />
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => setFilter('guardians')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'guardians'
              ? 'bg-guardian-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Guardian Posts
        </button>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'guardians' ? 'No Guardian Posts Yet' : 'No Posts Yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'guardians'
              ? 'Be the first guardian to share your expertise!'
              : 'Be the first to start a conversation in the community!'
            }
          </p>
          {isConnected && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn btn-primary"
            >
              Create the First Post
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onUpvote={() => handleUpvote(post.id)}
            />
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <CreatePostModal
          onClose={() => setIsCreateModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {/* Community Guidelines */}
      <div className="mt-12 p-6 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">
          Community Guidelines
        </h3>
        <ul className="space-y-2 text-purple-800 text-sm">
          <li>• Respect privacy and anonymity - never ask for personal identifying information</li>
          <li>• Keep discussions focused on women's health and HPV-related topics</li>
          <li>• Provide support and encouragement to fellow community members</li>
          <li>• Trust verified guardians for moderation and medical guidance</li>
          <li>• Report inappropriate content to help maintain a safe space</li>
        </ul>
      </div>
    </div>
  );
}