import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Web3State } from '../types/blockchain';

export function useWeb3() {
  const [web3State, setWeb3State] = useState<Web3State>({
    provider: null,
    account: null,
    chainId: null,
    connected: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window.avalanche === 'undefined') {
        throw new Error('Core Wallet is not installed. Please install Core Wallet to continue.');
      }

      const accounts = await window.avalanche.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.avalanche);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();

      setWeb3State({
        provider,
        account,
        chainId: network.chainId,
        connected: true,
      });
    } catch (err: any) {
      let errorMessage = 'Failed to connect to Core Wallet';
      
      if (err.code === 4001) {
        errorMessage = 'You rejected the connection request. Please try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setWeb3State({
        provider: null,
        account: null,
        chainId: null,
        connected: false,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (typeof window.avalanche !== 'undefined') {
      window.avalanche.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setWeb3State((prev) => ({
            ...prev,
            account: accounts[0],
          }));
        } else {
          setWeb3State({
            provider: null,
            account: null,
            chainId: null,
            connected: false,
          });
        }
      });

      window.avalanche.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return { ...web3State, connectWallet, error, isConnecting };
}