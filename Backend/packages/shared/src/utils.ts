import { DeploymentInfo } from './types';

export function generatePostId(): string {
  return `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateChipId(): string {
  return `0x${Date.now().toString(16)}${Math.random().toString(16).substr(2, 8)}`;
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString();
}

export function formatEther(wei: string): string {
  const ether = Number(wei) / 1e18;
  return ether.toFixed(4);
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function loadDeploymentInfo(): DeploymentInfo | null {
  try {
    return require('../addresses.json');
  } catch {
    return null;
  }
}

export function mockSelfProof(): { proof: string; publicSignals: string[] } {
  return {
    proof: '0x' + '0'.repeat(512), // Mock proof
    publicSignals: ['female', '18+', 'vaccinated']
  };
}

export function mockNFCRead(): string {
  return generateChipId();
}