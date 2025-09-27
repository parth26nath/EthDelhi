import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { hardhat, polygonMumbai } from 'viem/chains';
import addresses from './addresses.json';

// Chain configuration
const getChain = () => {
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '31337');

  switch (chainId) {
    case 31337:
      return hardhat;
    case 80002:
      return polygonMumbai;
    default:
      return hardhat;
  }
};

// Public client for reading from contracts
export const publicClient = createPublicClient({
  chain: getChain(),
  transport: http(),
});

// Wallet client for writing to contracts (when connected)
export const getWalletClient = () => {
  if (typeof window === 'undefined') return null;

  return createWalletClient({
    chain: getChain(),
    transport: custom((window as any).ethereum),
  });
};

// Contract addresses
export const CONTRACT_ADDRESSES = {
  HPVGuardianRegistry: addresses.contracts.HPVGuardianRegistry.address as `0x${string}`,
  HPVForum: addresses.contracts.HPVForum.address as `0x${string}`,
  HPVRewards: addresses.contracts.HPVRewards.address as `0x${string}`,
};

// Contract ABIs (simplified for demo)
export const GUARDIAN_REGISTRY_ABI = [
  {
    "inputs": [{"name": "clinic", "type": "address"}],
    "name": "registerClinic",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "chipId", "type": "bytes32"}, {"name": "clinicSig", "type": "bytes"}],
    "name": "registerVaccination",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "chipId", "type": "bytes32"}, {"name": "zkProof", "type": "bytes"}],
    "name": "becomeGuardian",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "isGuardian",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const FORUM_ABI = [
  {
    "inputs": [{"name": "postId", "type": "bytes32"}, {"name": "cid", "type": "string"}],
    "name": "createPost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "postId", "type": "bytes32"}],
    "name": "upvote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "postId", "type": "bytes32"}],
    "name": "getPost",
    "outputs": [
      {"name": "author", "type": "address"},
      {"name": "cid", "type": "string"},
      {"name": "timestamp", "type": "uint256"},
      {"name": "upvotes", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const REWARDS_ABI = [
  {
    "inputs": [{"name": "recipients", "type": "address[]"}, {"name": "amounts", "type": "uint256[]"}],
    "name": "allocateRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getUnclaimedAmount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract interaction helpers
export const readContract = async (
  address: `0x${string}`,
  abi: any,
  functionName: string,
  args?: any[]
) => {
  try {
    return await publicClient.readContract({
      address,
      abi,
      functionName,
      args,
    });
  } catch (error) {
    console.error(`Failed to read contract ${functionName}:`, error);
    throw error;
  }
};

export const writeContract = async (
  address: `0x${string}`,
  abi: any,
  functionName: string,
  args?: any[]
) => {
  const walletClient = getWalletClient();
  if (!walletClient) {
    throw new Error('Wallet not connected');
  }

  try {
    const { request } = await publicClient.simulateContract({
      address,
      abi,
      functionName,
      args,
      account: (await walletClient.getAddresses())[0],
    });

    return await walletClient.writeContract(request);
  } catch (error) {
    console.error(`Failed to write contract ${functionName}:`, error);
    throw error;
  }
};

// Utility functions
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const stringToBytes32 = (str: string): `0x${string}` => {
  // Simple implementation - in production, use proper encoding
  const hex = Buffer.from(str).toString('hex').padEnd(64, '0').slice(0, 64);
  return `0x${hex}`;
};