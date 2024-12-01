export type WalletType = 'metamask' | 'core';

export interface WalletState {
  connected: boolean;
  address: string;
  type: WalletType | null;
  balance: string;
}

export interface WalletTransaction {
  from: string;
  to: string;
  value: string;
  hash: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}