'use client';

import { useState } from 'react';
import { selfProtocol } from '@/lib/selfAdapter';
import toast from 'react-hot-toast';

interface SelfProtocolVerifierProps {
  chipId: string;
  onProofGenerated: (proof: string) => void;
}

export function SelfProtocolVerifier({ chipId, onProofGenerated }: SelfProtocolVerifierProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [proofStatus, setProofStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');

  const generateProof = async () => {
    try {
      setIsGenerating(true);
      setProofStatus('generating');
      toast.loading('Generating zero-knowledge proof...', { id: 'zk-proof' });

      const result = await selfProtocol.generateProof({ chipId });

      toast.success('ZK proof generated successfully!', { id: 'zk-proof' });
      setProofStatus('success');
      onProofGenerated(result.proof);
    } catch (error) {
      console.error('ZK proof generation failed:', error);
      toast.error(error instanceof Error ? error.message : 'Proof generation failed', { id: 'zk-proof' });
      setProofStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="text-center p-6">
      {/* Status Display */}
      <div className="mb-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
          proofStatus === 'generating' ? 'bg-blue-100' :
          proofStatus === 'success' ? 'bg-green-100' :
          proofStatus === 'error' ? 'bg-red-100' : 'bg-gray-100'
        }`}>
          {proofStatus === 'generating' && (
            <div className="loading-spinner w-8 h-8 border-blue-600"></div>
          )}
          {proofStatus === 'success' && (
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {proofStatus === 'error' && (
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
          {proofStatus === 'idle' && (
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-2">{selfProtocol.getStatus()}</p>

        {proofStatus === 'generating' && (
          <p className="text-blue-600 font-medium">
            Generating proof... This may take a moment.
          </p>
        )}
        {proofStatus === 'success' && (
          <p className="text-green-600 font-medium">
            Zero-knowledge proof generated successfully!
          </p>
        )}
        {proofStatus === 'error' && (
          <p className="text-red-600 font-medium">
            Proof generation failed. Please try again.
          </p>
        )}
      </div>

      {/* Requirements Display */}
      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="font-semibold text-purple-800 mb-3">Guardian Requirements</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-purple-700">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Female gender (self-reported)
          </div>
          <div className="flex items-center text-purple-700">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Age 18 or older
          </div>
          <div className="flex items-center text-purple-700">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            HPV vaccination completed
          </div>
          <div className="flex items-center text-purple-700">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Clinic verification via NFC chip
          </div>
        </div>
      </div>

      {/* Chip ID Display */}
      <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">Chip ID:</p>
        <p className="font-mono text-sm text-gray-900 break-all">{chipId}</p>
      </div>

      {/* Action Button */}
      {proofStatus !== 'success' && (
        <button
          onClick={generateProof}
          disabled={isGenerating}
          className="btn btn-guardian w-full"
        >
          {isGenerating ? (
            <>
              <div className="loading-spinner mr-2"></div>
              Generating Proof...
            </>
          ) : proofStatus === 'error' ? (
            'Retry Proof Generation'
          ) : (
            'Generate ZK Proof'
          )}
        </button>
      )}

      {/* Demo Notice */}
      {process.env.NEXT_PUBLIC_MOCK_SELF === 'true' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-700">
            <strong>Demo Mode:</strong> This generates a mock ZK proof. In production,
            this would use Self Protocol to create a real zero-knowledge proof of your eligibility.
          </p>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mt-6 text-xs text-gray-500">
        <p>
          🔒 Zero-knowledge proofs ensure your personal information remains private
          while proving you meet the guardian requirements.
        </p>
      </div>
    </div>
  );
}