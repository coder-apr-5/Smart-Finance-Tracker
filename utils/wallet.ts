import { WalletType } from '../types/wallet';

export function getWalletName(type: WalletType): string {
  return type === 'metamask' ? 'MetaMask' : 'Core Wallet';
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function validateAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}