'use client';

import { useState } from 'react';
import { nfcAdapter } from '@/lib/nfc';
import toast from 'react-hot-toast';

interface NFCScannerProps {
  onChipDetected: (chipId: string) => void;
}

export function NFCScanner({ onChipDetected }: NFCScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [mockChipId, setMockChipId] = useState('');
  const [showMockInput, setShowMockInput] = useState(process.env.NEXT_PUBLIC_MOCK_NFC === 'true');

  const startScan = async () => {
    try {
      setIsScanning(true);
      toast.loading('Scanning for NFC tag...', { id: 'nfc-scan' });

      const result = await nfcAdapter.startScan();

      toast.success('NFC tag detected!', { id: 'nfc-scan' });
      onChipDetected(result.chipId);
    } catch (error) {
      console.error('NFC scan failed:', error);
      toast.error(error instanceof Error ? error.message : 'NFC scan failed', { id: 'nfc-scan' });
    } finally {
      setIsScanning(false);
    }
  };

  const simulateTap = () => {
    if (!mockChipId.trim()) {
      toast.error('Please enter a chip ID');
      return;
    }

    const chipId = mockChipId.startsWith('0x') ? mockChipId : `0x${mockChipId}`;
    toast.success('Mock chip detected!');
    onChipDetected(chipId);
  };

  const generateFakeChip = () => {
    const fakeChipId = nfcAdapter.generateMockChipId();
    setMockChipId(fakeChipId);
    toast.success('Fake chip ID generated!');
    onChipDetected(fakeChipId);
  };

  if (!nfcAdapter.isSupported() && !showMockInput) {
    return (
      <div className="text-center p-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">NFC Not Supported</h3>
        <p className="text-gray-600 mb-4">
          Your browser doesn't support NFC scanning. You can still proceed using the mock mode.
        </p>
        <button
          onClick={() => setShowMockInput(true)}
          className="btn btn-primary"
        >
          Use Mock Mode
        </button>
      </div>
    );
  }

  return (
    <div className="text-center p-6">
      {/* NFC Status */}
      <div className="mb-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isScanning ? 'bg-blue-100 nfc-scanning' : 'bg-gray-100'
        }`}>
          <svg className={`w-10 h-10 ${isScanning ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        </div>
        <p className="text-sm text-gray-600 mb-2">{nfcAdapter.getStatus()}</p>
        {isScanning && (
          <p className="text-blue-600 font-medium">Hold your wristband near the device...</p>
        )}
      </div>

      {/* Real NFC Scanning */}
      {!showMockInput && (
        <div className="space-y-4">
          <button
            onClick={startScan}
            disabled={isScanning}
            className="btn btn-guardian w-full"
          >
            {isScanning ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Scanning...
              </>
            ) : (
              'Start NFC Scan'
            )}
          </button>

          <button
            onClick={() => setShowMockInput(true)}
            className="btn btn-secondary w-full"
          >
            Use Mock Mode Instead
          </button>
        </div>
      )}

      {/* Mock Mode */}
      {showMockInput && (
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Demo Mode</h4>
            <p className="text-sm text-yellow-700">
              In production, this would scan an actual NFC wristband from your vaccination clinic.
            </p>
          </div>

          <div>
            <label htmlFor="chipId" className="block text-sm font-medium text-gray-700 mb-2">
              Chip ID (for testing)
            </label>
            <input
              type="text"
              id="chipId"
              value={mockChipId}
              onChange={(e) => setMockChipId(e.target.value)}
              placeholder="Enter chip ID or generate fake one"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guardian-500 focus:border-guardian-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={generateFakeChip}
              className="btn btn-secondary"
            >
              Generate Fake Chip
            </button>
            <button
              onClick={simulateTap}
              disabled={!mockChipId.trim()}
              className="btn btn-guardian"
            >
              Simulate Tap
            </button>
          </div>

          {!nfcAdapter.isSupported() && (
            <p className="text-xs text-gray-500 mt-4">
              NFC scanning would be available on supported devices with the actual app.
            </p>
          )}
        </div>
      )}
    </div>
  );
}