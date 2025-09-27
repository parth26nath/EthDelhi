'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@/components/ConnectWallet';
import { NFCScanner } from '@/components/NFCScanner';
import { SelfProtocolVerifier } from '@/components/SelfProtocolVerifier';
import { GuardianMinter } from '@/components/GuardianMinter';

type VerificationStep = 'connect' | 'nfc' | 'zk' | 'mint' | 'complete';

export default function VerifyPage() {
  const { isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState<VerificationStep>('connect');
  const [chipId, setChipId] = useState<string>('');
  const [zkProof, setZkProof] = useState<string>('');

  const steps = [
    { id: 'connect', title: 'Connect Wallet', description: 'Connect your wallet to continue' },
    { id: 'nfc', title: 'NFC Scan', description: 'Tap your vaccination wristband' },
    { id: 'zk', title: 'ZK Verification', description: 'Prove your eligibility privately' },
    { id: 'mint', title: 'Mint Guardian NFT', description: 'Complete verification and become a guardian' },
    { id: 'complete', title: 'Complete', description: 'You are now a verified guardian!' },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="max-w-4xl px-4 py-12 mx-auto">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Become a Guardian
        </h1>
        <p className="text-lg text-gray-600">
          Verify your vaccination status and join our trusted moderator community
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStepIndex
                  ? 'bg-guardian-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${
                  index <= currentStepIndex ? 'text-guardian-600' : 'text-gray-600'
                }`}>
                  {step.title}
                </p>
                <p className="mt-1 text-xs text-gray-500 max-w-24">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 w-full mt-4 ${
                  index < currentStepIndex ? 'bg-guardian-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-8 card">
        {currentStep === 'connect' && (
          <div className="text-center">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Connect Your Wallet
            </h2>
            <p className="mb-6 text-gray-600">
              You'll need a connected wallet to proceed with verification and receive your Guardian NFT.
            </p>
            {isConnected ? (
              <div>
                <div className="mb-4 text-green-600">✓ Wallet connected!</div>
                <button
                  onClick={() => setCurrentStep('nfc')}
                  className="btn btn-guardian"
                >
                  Continue to NFC Scan
                </button>
              </div>
            ) : (
              <ConnectWallet />
            )}
          </div>
        )}

        {currentStep === 'nfc' && (
          <div className="text-center">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Scan Your NFC Wristband
            </h2>
            <p className="mb-6 text-gray-600">
              Tap your vaccination verification wristband to prove your chip ID.
            </p>
            <NFCScanner
              onChipDetected={(detectedChipId) => {
                setChipId(detectedChipId);
                setCurrentStep('zk');
              }}
            />
          </div>
        )}

        {currentStep === 'zk' && (
          <div className="text-center">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Zero-Knowledge Verification
            </h2>
            <p className="mb-6 text-gray-600">
              Prove you meet the guardian requirements (female, 18+, vaccinated) without revealing personal information.
            </p>
            <SelfProtocolVerifier
              chipId={chipId}
              onProofGenerated={(proof) => {
                setZkProof(proof);
                setCurrentStep('mint');
              }}
            />
          </div>
        )}

        {currentStep === 'mint' && (
          <div className="text-center">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Mint Your Guardian NFT
            </h2>
            <p className="mb-6 text-gray-600">
              Complete the verification process by minting your Guardian NFT on-chain.
            </p>
            <GuardianMinter
              chipId={chipId}
              zkProof={zkProof}
              onMinted={() => setCurrentStep('complete')}
            />
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-guardian-100">
              <svg className="w-10 h-10 text-guardian-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Congratulations, Guardian! 🎉
            </h2>
            <p className="mb-8 text-gray-600">
              You've successfully verified your status and minted your Guardian NFT.
              You can now moderate posts and earn rewards for helping the community.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a href="/forum" className="btn btn-guardian">
                Start Moderating
              </a>
              <a href="/leaderboard" className="btn btn-secondary">
                View Leaderboard
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="p-6 mt-8 border border-blue-200 rounded-lg bg-blue-50">
        <h3 className="mb-3 text-lg font-semibold text-blue-900">Guardian Benefits</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Verified Guardian badge on all posts and comments
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Ability to moderate and guide community discussions
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Eligible for reward allocations based on community contributions
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Exclusive access to guardian-only discussions
          </li>
        </ul>
      </div>
    </div>
  );
}