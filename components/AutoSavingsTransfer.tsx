import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Loader2, AlertCircle } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { useWalletConnection } from '../hooks/useWalletConnection';
import { executeTransfer } from '../services/transactionService';
import { formatUSD } from '../utils/currency';
import { getWalletProvider } from '../services/walletProvider';
import { validateWalletAddress } from '../utils/validation';

export function AutoSavingsTransfer() {
  const { stats } = useFinanceStore();
  const { connected, address, type } = useWalletConnection();
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [isValidAddress, setIsValidAddress] = useState(true);

  useEffect(() => {
    if (address) {
      setIsValidAddress(validateWalletAddress(address));
    }
  }, [address]);

  const handleTransfer = async () => {
    if (!connected || !address || stats.savings <= 0 || !type) return;
    
    if (!isValidAddress) {
      setError('Invalid wallet address. Please check your connected wallet.');
      return;
    }

    setIsTransferring(true);
    setError(null);
    setTransactionHash(null);

    try {
      const provider = getWalletProvider(type);
      console.log('Initiating transfer:', {
        to: address,
        amount: stats.savings,
        walletType: type
      });

      const transaction = await executeTransfer(
        provider,
        address,
        stats.savings,
        type
      );

      setTransactionHash(transaction.hash);
      console.log('Transfer successful:', transaction);
    } catch (err: any) {
      console.error('Transfer failed:', err);
      setError(err.message || 'Failed to transfer savings. Please try again.');
    } finally {
      setIsTransferring(false);
    }
  };

  if (!connected) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Auto-Save to Wallet</h2>
        <p className="text-gray-600 mb-4">
          Connect your {type === 'core' ? 'Core Wallet' : 'MetaMask'} to enable automatic savings transfer
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Auto-Save to Wallet</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Available Savings</span>
          <span className="font-semibold text-green-600">
            {formatUSD(stats.savings)}
          </span>
        </div>

        <div className="text-sm text-gray-600">
          <p>Connected Wallet: {type === 'core' ? 'Core Wallet' : 'MetaMask'}</p>
          <div className="flex items-center gap-2">
            <p>Address: {address}</p>
            {!isValidAddress && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>

        <button
          onClick={handleTransfer}
          disabled={isTransferring || stats.savings <= 0 || !isValidAddress}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTransferring ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Transfer Savings to Wallet</span>
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </>
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          </div>
        )}

        {transactionHash && (
          <div className="mt-4 p-4 bg-green-50 rounded-md">
            <p className="text-sm text-green-600">
              Transfer successful! 
            </p>
            <p className="text-xs text-green-500 break-all mt-1">
              Transaction hash: {transactionHash}
            </p>
          </div>
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