import { BrowserProvider, formatEther, parseEther, TransactionResponse } from 'ethers';
import { WalletTransaction } from '../types/wallet';

export async function transferBalance(
  provider: BrowserProvider,
  to: string,
  amount: string
): Promise<WalletTransaction> {
  try {
    const signer = await provider.getSigner();
    const fromAddress = await signer.getAddress();
    
    // Convert amount from USD to ETH (simplified conversion for demo)
    const ethAmount = (parseFloat(amount) / 2000).toString(); // Assuming 1 ETH = $2000
    const value = parseEther(ethAmount);

    console.log('Transfer details:', {
      from: fromAddress,
      to,
      value: formatEther(value),
      rawAmount: amount
    });

    const tx: TransactionResponse = await signer.sendTransaction({
      to,
      value,
      gasLimit: 21000, // Standard ETH transfer gas limit
    });

    console.log('Transaction hash:', tx.hash);

    const receipt = await tx.wait();
    console.log('Transaction receipt:', receipt);

    return {
      from: fromAddress,
      to,
      value: ethAmount,
      hash: tx.hash,
      timestamp: Math.floor(Date.now() / 1000),
      status: receipt?.status === 1 ? 'confirmed' : 'failed',
    };
  } catch (error: any) {
    console.error('Transfer error:', error);
    throw new Error(
      error.message || 'Failed to transfer balance. Please check your wallet connection and try again.'
    );
  }
}

export async function getWalletBalance(
  provider: BrowserProvider,
  address: string
): Promise<string> {
  try {
    const balance = await provider.getBalance(address);
    return formatEther(balance);
  } catch (error: any) {
    console.error('Balance check error:', error);
    throw new Error('Failed to get wallet balance');
  }
}