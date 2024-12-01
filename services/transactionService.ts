import { BrowserProvider, TransactionResponse, isAddress } from 'ethers';
import { WalletTransaction } from '../types/wallet';
import { convertUSDToETH } from '../utils/currency';
import { validateWalletAddress, validateTransferAmount } from '../utils/validation';
import { ensureCorrectNetwork } from './networkService';
import { WalletType } from '../types/wallet';

export async function executeTransfer(
  provider: BrowserProvider,
  to: string,
  amountUSD: number,
  type: WalletType
): Promise<WalletTransaction> {
  // Validate inputs
  if (!validateWalletAddress(to)) {
    throw new Error('Invalid wallet address');
  }

  if (!validateTransferAmount(amountUSD)) {
    throw new Error('Invalid transfer amount');
  }

  try {
    // Ensure correct network
    await ensureCorrectNetwork(provider, type);

    const signer = await provider.getSigner();
    const fromAddress = await signer.getAddress();
    
    // Convert USD to ETH
    const ethAmount = convertUSDToETH(amountUSD);
    
    // Validate balance
    const balance = await provider.getBalance(fromAddress);
    if (balance < ethAmount) {
      throw new Error('Insufficient balance for transfer');
    }

    console.log('Transfer details:', {
      from: fromAddress,
      to,
      amountUSD,
      ethAmount: ethAmount.toString(),
      network: type === 'core' ? 'Avalanche C-Chain' : 'Ethereum Mainnet'
    });

    // Execute transfer with proper gas estimation
    const gasEstimate = await provider.estimateGas({
      to,
      value: ethAmount,
      from: fromAddress
    });

    const tx: TransactionResponse = await signer.sendTransaction({
      to,
      value: ethAmount,
      gasLimit: gasEstimate * 120n / 100n // Add 20% buffer to gas estimate
    });

    console.log('Transaction initiated:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);

    if (!receipt || receipt.status === 0) {
      throw new Error('Transaction failed');
    }

    return {
      from: fromAddress,
      to,
      value: ethAmount.toString(),
      hash: tx.hash,
      timestamp: Math.floor(Date.now() / 1000),
      status: 'confirmed'
    };
  } catch (error: any) {
    console.error('Transfer failed:', error);
    
    // Provide user-friendly error messages
    if (error.code === 'ACTION_REJECTED') {
      throw new Error('Transaction was rejected. Please try again.');
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Insufficient funds to cover the transfer and gas fees.');
    } else if (error.code === 'NETWORK_ERROR') {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    throw new Error(error.message || 'Failed to transfer funds. Please try again.');
  }
}