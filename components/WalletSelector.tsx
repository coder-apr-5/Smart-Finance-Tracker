import React from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { useWalletConnection } from '../hooks/useWalletConnection';
import { WalletType } from '../types/wallet';
import { formatAddress, getWalletName } from '../utils/wallet';

export function WalletSelector() {
  const {
    connected,
    address,
    type,
    balance,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
  } = useWalletConnection();

  const handleConnect = async (walletType: WalletType) => {
    await connectWallet(walletType);
  };

  if (connected) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">
            {type && getWalletName(type)}
          </span>
          <span className="text-xs text-gray-500">
            {formatAddress(address)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{balance} ETH</span>
          <button
            onClick={disconnectWallet}
            className="text-xs text-red-600 hover:text-red-700"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <button
          onClick={() => handleConnect('metamask')}
          disabled={isConnecting}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isConnecting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Wallet className="w-4 h-4 mr-2" />
          )}
          Connect MetaMask
        </button>
        <button
          onClick={() => handleConnect('core')}
          disabled={isConnecting}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
        >
          {isConnecting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Wallet className="w-4 h-4 mr-2" />
          )}
          Connect Core Wallet
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}