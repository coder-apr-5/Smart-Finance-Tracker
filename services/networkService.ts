import { BrowserProvider } from 'ethers';
import { WalletType } from '../types/wallet';

export async function ensureCorrectNetwork(provider: BrowserProvider, type: WalletType): Promise<void> {
  const network = await provider.getNetwork();
  const chainId = network.chainId.toString(16);
  const expectedChainId = type === 'core' ? '0xa86a' : '0x1';
  
  if (`0x${chainId}` !== expectedChainId) {
    const networkName = type === 'core' ? 'Avalanche C-Chain' : 'Ethereum Mainnet';
    throw new Error(`Please switch to ${networkName} in your wallet`);
  }
}