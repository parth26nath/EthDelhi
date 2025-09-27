// Shared types for HPV Warriors DAO

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

export interface ContractAddresses {
  HPVGuardianRegistry: string;
  HPVForum: string;
  HPVRewards: string;
}

export interface SelfProofInputs {
  chipId: string;
  // Additional inputs as needed by Self Protocol
}

export interface SelfProofResponse {
  proof: string;
  publicSignals: string[];
}

export interface NFCData {
  chipId: string;
  timestamp: number;
}

// Event types matching contract events
export interface ChipVerifiedEvent {
  chipId: string;
  clinic: string;
  timestamp: bigint;
}

export interface GuardianNFTMintedEvent {
  guardian: string;
  chipId: string;
  tokenId: bigint;
}

export interface PostCreatedEvent {
  postId: string;
  author: string;
  cid: string;
  timestamp: bigint;
}

export interface PostUpvotedEvent {
  postId: string;
  voter: string;
  timestamp: bigint;
}

export interface RewardAllocatedEvent {
  recipient: string;
  amount: bigint;
  timestamp: bigint;
}