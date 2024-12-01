import { ethers } from 'ethers';

declare global {
  interface Window {
    avalanche: any;
  }
}

export interface Web3State {
  provider: ethers.providers.Web3Provider | null;
  account: string | null;
  chainId: number | null;
  connected: boolean;
}

export interface SmartContractTransaction extends Transaction {
  txHash: string;
  blockNumber: number;
  timestamp: number;
  confirmed: boolean;
}

export interface RewardToken {
  balance: string;
  earned: string;
  address: string;
}

export interface LendingPool {
  id: string;
  totalSupply: string;
  apy: number;
  minAmount: string;
  maxAmount: string;
  duration: number;
}