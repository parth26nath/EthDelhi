'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

interface GuardianMinterProps {
  chipId: string;
  zkProof: string;
  onMinted: () => void;
}

export function GuardianMinter({ chipId, zkProof, onMinted }: GuardianMinterProps) {
  const { address } = useAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<'idle' | 'minting' | 'success' | 'error'>('idle');

  const mintGuardianNFT = async () => {
    try {
      setIsMinting(true);
      setMintStatus('minting');
      toast.loading('Minting Guardian NFT...', { id: 'mint-nft' });

      // In a real implementation, this would:
      // 1. Call HPVGuardianRegistry.becomeGuardian(chipId, zkProof)
      // 2. Wait for transaction confirmation
      // 3. Update local state

      // Mock blockchain interaction
      const mockTxHash = `0x${Math.random().toString(16).slice(2).padStart(64, '0')}`;
      console.log(`Would call HPVGuardianRegistry.becomeGuardian("${chipId}", "${zkProof}") with tx: ${mockTxHash}`);

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock success
      toast.success('Guardian NFT minted successfully!', { id: 'mint-nft' });
      setMintStatus('success');
      onMinted();
    } catch (error) {
      console.error('Guardian NFT minting failed:', error);
      toast.error(error instanceof Error ? error.message : 'Minting failed', { id: 'mint-nft' });
      setMintStatus('error');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="text-center p-6">
      {/* Status Display */}
      <div className="mb-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
          mintStatus === 'minting' ? 'bg-blue-100' :
          mintStatus === 'success' ? 'bg-green-100' :
          mintStatus === 'error' ? 'bg-red-100' : 'bg-guardian-100'
        }`}>
          {mintStatus === 'minting' && (
            <div className="loading-spinner w-8 h-8 border-blue-600"></div>
          )}
          {mintStatus === 'success' && (
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {mintStatus === 'error' && (
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
          {mintStatus === 'idle' && (
            <svg className="w-10 h-10 text-guardian-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          )}
        </div>

        {mintStatus === 'minting' && (
          <p className="text-blue-600 font-medium">
            Minting your Guardian NFT... Please confirm the transaction.
          </p>
        )}
        {mintStatus === 'success' && (
          <p className="text-green-600 font-medium">
            Guardian NFT minted successfully!
          </p>
        )}
        {mintStatus === 'error' && (
          <p className="text-red-600 font-medium">
            Minting failed. Please try again.
          </p>
        )}
      </div>

      {/* Verification Summary */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Verification Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Wallet:</span>
            <span className="font-mono text-gray-900">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Chip ID:</span>
            <span className="font-mono text-gray-900">
              {chipId.slice(0, 10)}...
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">ZK Proof:</span>
            <span className="text-green-600">✓ Valid</span>
          </div>
        </div>
      </div>

      {/* Guardian Benefits */}
      <div className="mb-6 p-4 bg-guardian-50 border border-guardian-200 rounded-lg">
        <h4 className="font-semibold text-guardian-800 mb-3">Your Guardian Benefits</h4>
        <div className="space-y-2 text-sm text-guardian-700">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Verified Guardian badge on all posts
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Enhanced trust and credibility
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Eligible for community rewards
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Help moderate and guide discussions
          </div>
        </div>
      </div>

      {/* Action Button */}
      {mintStatus !== 'success' && (
        <button
          onClick={mintGuardianNFT}
          disabled={isMinting}
          className="btn btn-guardian w-full"
        >
          {isMinting ? (
            <>
              <div className="loading-spinner mr-2"></div>
              Minting Guardian NFT...
            </>
          ) : mintStatus === 'error' ? (
            'Retry Minting'
          ) : (
            'Mint Guardian NFT'
          )}
        </button>
      )}

      {/* Transaction Info */}
      {mintStatus === 'minting' && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            🔗 This will create an on-chain transaction to mint your Guardian NFT.
            Gas fees will apply on mainnet.
          </p>
        </div>
      )}

      {/* Demo Notice */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-700">
          <strong>Demo Mode:</strong> This simulates the Guardian NFT minting process.
          In production, this would be a real on-chain ERC721 token.
        </p>
      </div>
    </div>
  );
}