import { parseEther } from 'ethers';

const ETH_USD_RATE = 2000; // Simplified fixed rate for demo

export function convertUSDToETH(usdAmount: number): bigint {
  const ethAmount = usdAmount / ETH_USD_RATE;
  return parseEther(ethAmount.toFixed(18));
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}