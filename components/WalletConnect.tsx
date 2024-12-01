import React from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';

export function WalletConnect() {
  const { account, connected, connectWallet, error, isConnecting } = useWeb3();

  return (
    <div className="flex items-center">
      {connected ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      ) : (
        <div className="flex flex-col items-end">
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            <span>{isConnecting ? 'Connecting...' : 'Connect Core Wallet'}</span>
          </button>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}