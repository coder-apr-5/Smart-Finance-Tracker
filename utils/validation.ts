import { isAddress } from 'ethers';
import { WalletType } from '../types/wallet';

export function validateWalletAddress(address: string): boolean {
  return isAddress(address);
}

export function validateTransferAmount(amount: number): boolean {
  return amount > 0 && Number.isFinite(amount);
}

export function validateNetwork(chainId: string, type: WalletType): boolean {
  // Avalanche C-Chain ID is '0xa86a' (43114)
  const expectedChainId = type === 'core' ? '0xa86a' : '0x1'; // '0x1' for Ethereum Mainnet
  return chainId === expectedChainId;
}