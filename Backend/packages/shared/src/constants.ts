import { ChainConfig } from './types';

export const SUPPORTED_CHAINS: Record<number, ChainConfig> = {
  31337: {
    chainId: 31337,
    name: 'Hardhat Local',
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorer: 'http://localhost:8545'
  },
  80002: {
    chainId: 80002,
    name: 'Polygon Amoy Testnet',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    blockExplorer: 'https://amoy.polygonscan.com'
  },
  480: {
    chainId: 480,
    name: 'World Chain',
    rpcUrl: 'https://worldchain-mainnet.g.alchemy.com/public',
    blockExplorer: 'https://worldscan.org'
  }
};

export const DEFAULT_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '31337');

export const WORLD_APP_URL = 'https://worldcoin.org/download';
export const WORLD_APP_DEEP_LINK = 'worldcoin://';

// IPFS Configuration
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';
export const WEB3_STORAGE_TOKEN = process.env.WEB3_STORAGE_TOKEN;

// Contract Event Topics
export const EVENT_TOPICS = {
  ChipVerified: '0x...',
  GuardianNFTMinted: '0x...',
  PostCreated: '0x...',
  PostUpvoted: '0x...',
  RewardAllocated: '0x...'
};

// Default values for development
export const DEVELOPMENT_DEFAULTS = {
  MOCK_CHIP_ID: '0x1234567890abcdef1234567890abcdef12345678',
  MOCK_ZK_PROOF: '0xmockproof123456789',
  CLINIC_PRIVATE_KEY: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
};