// Export all types and constants
export * from './types';
export * from './constants';

// Export contract addresses and ABIs when available
export { default as addresses } from './addresses.json';

// Utility functions
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEther = (value: bigint, decimals: number = 4): string => {
  const ethValue = Number(value) / 1e18;
  return ethValue.toFixed(decimals);
};

export const generatePostId = (title: string, author: string): string => {
  const timestamp = Date.now().toString();
  const content = `${title}-${author}-${timestamp}`;
  // Simple hash function for demo (in production, use proper hashing)
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`;
};