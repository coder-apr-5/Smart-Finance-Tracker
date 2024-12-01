import { BrowserProvider } from 'ethers';
import { WalletType } from '../types/wallet';

export function getWalletProvider(type: WalletType): BrowserProvider {
  const provider = type === 'metamask' 
    ? (window as any).ethereum 
    : (window as any).avalanche;

  if (!provider) {
    throw new Error(`${type === 'metamask' ? 'MetaMask' : 'Core Wallet'} is not installed`);
  }

  return new BrowserProvider(provider);
}

export async function requestWalletAccess(type: WalletType) {
  const provider = type === 'metamask' 
    ? (window as any).ethereum 
    : (window as any).avalanche;

  if (!provider) {
    throw new Error(`${type === 'metamask' ? 'MetaMask' : 'Core Wallet'} is not installed`);
  }

  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  
  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts found. Please check your wallet and try again.');
  }

  return accounts[0];
}