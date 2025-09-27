'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

export function ClinicRegistration() {
  const { address } = useAccount();
  const [clinicAddress, setClinicAddress] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clinicAddress.trim()) {
      toast.error('Please enter a clinic address');
      return;
    }

    if (!clinicAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    try {
      setIsRegistering(true);
      toast.loading('Registering clinic...', { id: 'clinic-register' });

      const response = await fetch('/api/admin/register-clinic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicAddress: clinicAddress.trim(),
          adminAddress: address,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Clinic registered successfully!', { id: 'clinic-register' });
        setClinicAddress('');
        console.log('Transaction hash:', result.txHash);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to register clinic', { id: 'clinic-register' });
      }
    } catch (error) {
      console.error('Clinic registration failed:', error);
      toast.error('Failed to register clinic', { id: 'clinic-register' });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Registration Form */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Register New Clinic
        </h3>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="clinicAddress" className="block text-sm font-medium text-gray-700 mb-2">
              Clinic Wallet Address
            </label>
            <input
              type="text"
              id="clinicAddress"
              value={clinicAddress}
              onChange={(e) => setClinicAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the Ethereum address of the clinic that will verify vaccinations
            </p>
          </div>

          <button
            type="submit"
            disabled={isRegistering || !clinicAddress.trim()}
            className="btn btn-primary w-full"
          >
            {isRegistering ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Registering Clinic...
              </>
            ) : (
              'Register Clinic'
            )}
          </button>
        </form>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>

        <div className="space-y-3">
          <button
            onClick={() => setClinicAddress(address || '')}
            className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="font-medium text-gray-900">Register My Wallet as Clinic</div>
            <div className="text-sm text-gray-600">Use your connected wallet as a clinic for testing</div>
          </button>

          <button
            onClick={() => setClinicAddress('0x1234567890123456789012345678901234567890')}
            className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="font-medium text-gray-900">Use Demo Clinic Address</div>
            <div className="text-sm text-gray-600">Pre-filled address for demonstration</div>
          </button>
        </div>
      </div>

      {/* Registered Clinics */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Registered Clinics
        </h3>

        <div className="space-y-3">
          {/* Mock registered clinics */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Demo Clinic #1</div>
              <div className="text-sm text-gray-600 font-mono">0x1234...7890</div>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Demo Clinic #2</div>
              <div className="text-sm text-gray-600 font-mono">0x2345...8901</div>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Only registered clinics can verify vaccination status and sign chip registrations.
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Clinic Registration Process</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Only contract owner can register clinics</li>
                <li>Registered clinics can verify vaccination chips</li>
                <li>Clinics sign vaccination proofs for guardian verification</li>
                <li>Each registration creates an on-chain transaction</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}