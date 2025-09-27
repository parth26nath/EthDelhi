// Local types for HPV Warriors DAO

export interface Post {
  id: string;
  author: string;
  title: string;
  body: string;
  cid?: string;
  createdAt: Date;
  upvotes?: number;
  isGuardianPost?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  body: string;
  createdAt: Date;
  isGuardianComment?: boolean;
}

export interface Guardian {
  id: string;
  wallet: string;
  chipId: string;
  timestamp: bigint;
}

export interface Reward {
  id: string;
  recipient: string;
  amount: bigint;
  timestamp: bigint;
  claimed: boolean;
}

export interface LeaderboardEntry {
  wallet: string;
  upvotes: number;
  posts: number;
  rewards: bigint;
}

export interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
}

export interface SelfProofInputs {
  chipId: string;
}

export interface SelfProofResponse {
  proof: string;
  publicSignals: string[];
}

export interface NFCData {
  chipId: string;
  timestamp: number;
}

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
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`;
};