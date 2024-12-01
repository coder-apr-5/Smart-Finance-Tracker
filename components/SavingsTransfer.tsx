import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency } from '../utils/formatters';

export function SavingsTransfer() {
  const { provider, account, connected } = useWeb3();
  const stats = useFinanceStore((state) => state.stats);
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransfer = async () => {
    if (!provider || !account || stats.savings <= 0) return;

    setIsTransferring(true);
    setError(null);

    try {
      const signer = provider.getSigner();
      const amountInWei = ethers.utils.parseEther(stats.savings.toString());
      
      const transaction = await signer.sendTransaction({
        to: account,
        value: amountInWei,
      });

      await transaction.wait();
    } catch (err: any) {
      setError(err.message || 'Failed to transfer savings');
    } finally {
      setIsTransferring(false);
    }
  };

  if (!connected) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-yellow-700">
          Connect your Core Wallet to transfer savings
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Transfer Savings</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Available Balance</span>
          <span className="font-semibold text-blue-600">
            {formatCurrency(stats.savings)}
          </span>
        </div>

        <button
          onClick={handleTransfer}
          disabled={isTransferring || stats.savings <= 0}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTransferring ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Transfer to Wallet</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </button>

        {error && (
          <p className="text-sm text-red-600 mt-2">{error}</p>
        )}

        {stats.savings <= 0 && (
          <p className="text-sm text-gray-500 text-center">
            No savings available to transfer
          </p>
        )}
      </div>
    </div>
  );
}