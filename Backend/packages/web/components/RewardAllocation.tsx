'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

interface RewardAllocation {
  recipient: string;
  amount: string;
}

export function RewardAllocation() {
  const { address } = useAccount();
  const [allocations, setAllocations] = useState<RewardAllocation[]>([
    { recipient: '', amount: '' }
  ]);
  const [isAllocating, setIsAllocating] = useState(false);

  const addAllocation = () => {
    setAllocations([...allocations, { recipient: '', amount: '' }]);
  };

  const removeAllocation = (index: number) => {
    setAllocations(allocations.filter((_, i) => i !== index));
  };

  const updateAllocation = (index: number, field: keyof RewardAllocation, value: string) => {
    const updated = [...allocations];
    updated[index][field] = value;
    setAllocations(updated);
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();

    const validAllocations = allocations.filter(
      allocation => allocation.recipient.trim() && allocation.amount.trim()
    );

    if (validAllocations.length === 0) {
      toast.error('Please add at least one valid allocation');
      return;
    }

    // Validate addresses and amounts
    for (const allocation of validAllocations) {
      if (!allocation.recipient.match(/^0x[a-fA-F0-9]{40}$/)) {
        toast.error(`Invalid recipient address: ${allocation.recipient}`);
        return;
      }

      if (isNaN(parseFloat(allocation.amount)) || parseFloat(allocation.amount) <= 0) {
        toast.error(`Invalid amount: ${allocation.amount}`);
        return;
      }
    }

    try {
      setIsAllocating(true);
      toast.loading('Allocating rewards...', { id: 'reward-allocate' });

      const response = await fetch('/api/admin/allocate-rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          allocations: validAllocations,
          adminAddress: address,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Rewards allocated to ${result.allocations} recipients!`, { id: 'reward-allocate' });
        setAllocations([{ recipient: '', amount: '' }]);
        console.log('Transaction hash:', result.txHash);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to allocate rewards', { id: 'reward-allocate' });
      }
    } catch (error) {
      console.error('Reward allocation failed:', error);
      toast.error('Failed to allocate rewards', { id: 'reward-allocate' });
    } finally {
      setIsAllocating(false);
    }
  };

  const loadTopContributors = () => {
    setAllocations([
      { recipient: '0x1111111111111111111111111111111111111111', amount: '0.1' },
      { recipient: '0x2222222222222222222222222222222222222222', amount: '0.08' },
      { recipient: '0x3333333333333333333333333333333333333333', amount: '0.05' },
    ]);
  };

  const totalAmount = allocations
    .filter(allocation => allocation.amount.trim())
    .reduce((sum, allocation) => sum + parseFloat(allocation.amount || '0'), 0);

  return (
    <div className="space-y-6">
      {/* Allocation Form */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Allocate Rewards
        </h3>

        <form onSubmit={handleAllocate} className="space-y-4">
          {allocations.map((allocation, index) => (
            <div key={index} className="flex space-x-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={allocation.recipient}
                  onChange={(e) => updateAllocation(index, 'recipient', e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={allocation.amount}
                  onChange={(e) => updateAllocation(index, 'amount', e.target.value)}
                  placeholder="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              {allocations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAllocation(index)}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={addAllocation}
              className="btn btn-secondary"
            >
              Add Recipient
            </button>

            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-lg font-semibold text-gray-900">
                {totalAmount.toFixed(3)} ETH
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isAllocating || totalAmount === 0}
            className="btn btn-primary w-full"
          >
            {isAllocating ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Allocating Rewards...
              </>
            ) : (
              `Allocate ${totalAmount.toFixed(3)} ETH to ${allocations.filter(a => a.recipient && a.amount).length} Recipients`
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
            onClick={loadTopContributors}
            className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="font-medium text-gray-900">Load Top Contributors</div>
            <div className="text-sm text-gray-600">Pre-fill with highest-ranked community members</div>
          </button>

          <button
            onClick={() => setAllocations([{ recipient: address || '', amount: '0.05' }])}
            className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="font-medium text-gray-900">Reward Myself (Demo)</div>
            <div className="text-sm text-gray-600">Allocate a small reward to your own wallet</div>
          </button>
        </div>
      </div>

      {/* Recent Allocations */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Allocations
        </h3>

        <div className="space-y-3">
          {/* Mock recent allocations */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">0x1111...1111</div>
              <div className="text-sm text-gray-600">2 hours ago</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">0.1 ETH</div>
              <div className="text-sm text-green-600">Allocated</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">0x2222...2222</div>
              <div className="text-sm text-gray-600">1 day ago</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">0.08 ETH</div>
              <div className="text-sm text-green-600">Allocated</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">0x3333...3333</div>
              <div className="text-sm text-gray-600">3 days ago</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">0.05 ETH</div>
              <div className="text-sm text-green-600">Allocated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Reward Allocation Guidelines</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Rewards should reflect community contributions and helpfulness</li>
                <li>Consider post quality, upvotes received, and guardian activity</li>
                <li>Ensure the contract has sufficient ETH balance for allocations</li>
                <li>Recipients can claim their rewards from the contract</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}