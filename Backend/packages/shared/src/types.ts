export interface DeploymentInfo {
  network: string;
  chainId: string;
  deployer: string;
  contracts: {
    HPVGuardianRegistry: string;
    HPVForum: string;
    HPVRewards: string;
  };
  timestamp: string;
}

export interface Post {
  id: string;
  author: string;
  title: string;
  body: string;
  cid?: string;
  createdAt: Date;
  upvotes?: number;
  isGuardian?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  body: string;
  createdAt: Date;
  isGuardian?: boolean;
}

export interface GuardianData {
  wallet: string;
  chipId: string;
  tokenId: number;
  timestamp: number;
}

export interface RewardAllocation {
  id: number;
  recipient: string;
  amount: string;
  timestamp: number;
  claimed: boolean;
}

export interface LeaderboardEntry {
  wallet: string;
  upvotes: number;
  postsCreated: number;
  isGuardian: boolean;
}

export interface NFCData {
  chipId: string;
  isValid: boolean;
}

export interface SelfProof {
  proof: string;
  publicSignals: string[];
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
}

export const CHAIN_CONFIG = {
  POLYGON_AMOY: {
    chainId: 80002,
    name: 'Polygon Amoy',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    blockExplorer: 'https://amoy.polygonscan.com'
  },
  WORLD_CHAIN: {
    chainId: 480,
    name: 'World Chain',
    rpcUrl: 'https://worldchain-mainnet.g.alchemy.com/public',
    blockExplorer: 'https://worldscan.org'
  }
} as const;