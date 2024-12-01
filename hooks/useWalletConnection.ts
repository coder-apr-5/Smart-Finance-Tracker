import { useState, useCallback, useEffect } from 'react';
import { BrowserProvider, formatEther } from 'ethers';
import { WalletType } from '../types/wallet';

export function useWalletConnection() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletState, setWalletState] = useState({
    connected: false,
    address: '',
    type: null as WalletType | null,
    balance: '0',
  });

  const updateBalance = useCallback(async () => {
    if (!walletState.connected || !walletState.address) return;

    try {
      const provider = walletState.type === 'metamask'
        ? (window as any).ethereum
        : (window as any).avalanche;

      const ethersProvider = new BrowserProvider(provider);
      const balance = await ethersProvider.getBalance(walletState.address);
      
      setWalletState(prev => ({
        ...prev,
        balance: formatEther(balance)
      }));
    } catch (err) {
      console.error('Failed to update balance:', err);
    }
  }, [walletState.connected, walletState.address, walletState.type]);

  const connectWallet = useCallback(async (type: WalletType) => {
    setIsConnecting(true);
    setError(null);

    try {
      const provider = type === 'metamask'
        ? (window as any).ethereum
        : (window as any).avalanche;

      if (!provider) {
        throw new Error(`${type === 'metamask' ? 'MetaMask' : 'Core Wallet'} is not installed`);
      }

      // Request account access
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please check your wallet and try again.');
      }

      // Get network information
      const chainId = await provider.request({ method: 'eth_chainId' });
      console.log('Connected to chain:', chainId);

      const ethersProvider = new BrowserProvider(provider);
      const balance = await ethersProvider.getBalance(accounts[0]);

      setWalletState({
        connected: true,
        address: accounts[0],
        type,
        balance: formatEther(balance),
      });

      // Setup event listeners
      provider.on('accountsChanged', (newAccounts: string[]) => {
        if (newAccounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletState(prev => ({
            ...prev,
            address: newAccounts[0]
          }));
        }
      });

      provider.on('chainChanged', () => {
        window.location.reload();
      });

    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
      setWalletState({
        connected: false,
        address: '',
        type: null,
        balance: '0',
      });
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      connected: false,
      address: '',
      type: null,
      balance: '0',
    });
    setError(null);
  }, []);

  // Update balance periodically
  useEffect(() => {
    if (walletState.connected) {
      const interval = setInterval(updateBalance, 15000); // Every 15 seconds
      return () => clearInterval(interval);
    }
  }, [walletState.connected, updateBalance]);

  return {
    ...walletState,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
  };
}