'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Post } from '@/lib/types';
import toast from 'react-hot-toast';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

export function CreatePostModal({ onClose, onPostCreated }: CreatePostModalProps) {
  const { address } = useAccount();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          author: address,
        }),
      });

      if (response.ok) {
        const newPost = await response.json();
        toast.success('Post created successfully!');
        onPostCreated(newPost);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Post creation failed:', error);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Create Anonymous Post
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Post Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., HPV vaccine side effects - your experiences?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/200 characters
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
              Your Question or Experience
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your question, experience, or advice. Remember, this will be posted anonymously but your wallet address will be visible to track contributions."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              maxLength={2000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {body.length}/2000 characters
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Privacy & Anonymity</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Your post will be displayed anonymously to other users</li>
              <li>• Your wallet address is used only for tracking contributions</li>
              <li>• No personal information is stored or displayed</li>
              <li>• Guardians can provide verified, trusted responses</li>
            </ul>
          </div>

          {/* Guardian Status */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-blue-800">
                  Not a Guardian yet?
                </p>
                <p className="text-blue-700">
                  <a href="/verify" className="underline hover:no-underline">
                    Verify your vaccination status
                  </a> to get a trusted Guardian badge on your posts.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !body.trim()}
              className="flex-1 btn btn-primary"
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Creating Post...
                </>
              ) : (
                'Create Post'
              )}
            </button>
          </div>
        </form>

        {/* Guidelines */}
        <div className="px-6 pb-6 pt-4 border-t border-gray-100">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Community Guidelines</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Keep discussions focused on women's health and HPV-related topics</li>
            <li>• Be respectful and supportive of other community members</li>
            <li>• Do not share personal identifying information</li>
            <li>• Trust verified guardians for medical guidance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}