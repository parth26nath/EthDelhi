# HPV Warriors DAO

**Anonymous women's health forum with verified guardians**

An end-to-end demonstration platform for EthDelhi hackathon showcasing Self Protocol ZK verification, NFC chip authentication, World App integration, and The Graph indexing for a privacy-first women's health community.

## 🏆 **12-Minute Judge Demo Script**

### **Quick Start (2 minutes)**
```bash
git clone <this-repo>
cd hpv-warriors
pnpm install
pnpm bootstrap
pnpm dev
```
Open http://localhost:3000

### **Demo Flow (10 minutes)**

#### 1. **Register Clinic** (1 min)
- Go to `/admin` → Connect wallet → "Clinic Management"
- Register your wallet address as authorized clinic
- ✅ **Shows**: Owner-only access control, on-chain clinic registry

#### 2. **Simulate NFC Tap → Verify via Self → Mint Guardian NFT** (2 min)
- Go to `/verify` → Connect wallet
- **NFC**: Click "Generate Fake Chip" → "Simulate Tap"
- **ZK**: Click "Generate ZK Proof" (mock Self Protocol)
- **Mint**: Complete verification → Receive Guardian NFT
- ✅ **Shows**: Full guardian onboarding flow, ZK privacy

#### 3. **Create Anonymous Post** (1 min)
- Go to `/forum` → "Create Post"
- Write sample health question → Submit
- Notice "Verified Guardian" badge appears
- ✅ **Shows**: Anonymous posting with verified moderation

#### 4. **Upvote from 2nd Wallet** (2 min)
- Switch to different wallet/account
- Find your post → Click upvote button
- See upvote count increase
- ✅ **Shows**: Cross-wallet interaction, on-chain events

#### 5. **Show Leaderboard** (2 min)
- Go to `/leaderboard`
- View community stats and rankings
- Sort by upvotes/posts/rewards
- ✅ **Shows**: The Graph-style data aggregation

#### 6. **Allocate Rewards → Show in UI** (2 min)
- Return to `/admin` → "Reward Allocation"
- Add wallet address + amount → Allocate
- Check leaderboard for updated rewards
- ✅ **Shows**: Reward distribution, admin functions

---

## 🚀 **Features**

### **Privacy & Verification**
- **Anonymous Posting**: Ask sensitive health questions without revealing identity
- **ZK Verification**: Self Protocol integration for proving guardian eligibility
- **NFC Authentication**: Vaccination chip verification (with Web NFC API)
- **Guardian System**: Verified moderators with on-chain proof

### **Blockchain Integration**
- **Smart Contracts**: Solidity contracts for registry, forum, and rewards
- **Multi-chain Ready**: Polygon Amoy testnet + World Chain compatible
- **The Graph Indexing**: Event tracking and leaderboard aggregation
- **WalletConnect v2**: Universal wallet compatibility

### **Community Features**
- **Forum Discussions**: Post questions, get guardian-verified answers
- **Upvoting System**: Community-driven content curation
- **Reward Distribution**: Compensate helpful contributors
- **Impact Tracking**: Transparent contribution metrics

---

## 🏗️ **Architecture**

```
hpv-warriors/
├── packages/
│   ├── contracts/         # Solidity + Hardhat
│   │   ├── contracts/     # HPVGuardianRegistry, HPVForum, HPVRewards
│   │   ├── scripts/       # Deploy scripts
│   │   └── test/          # Contract tests
│   ├── subgraph/          # The Graph indexing
│   │   ├── schema.graphql # Entity definitions
│   │   ├── subgraph.yaml  # Event mappings
│   │   └── src/           # TypeScript handlers
│   ├── web/               # Next.js App Router
│   │   ├── app/           # Pages (/, /verify, /forum, /leaderboard, /admin)
│   │   ├── components/    # React components
│   │   ├── lib/           # Adapters (Self, NFC, contracts)
│   │   └── prisma/        # Database schema + seed
│   └── shared/            # Types, constants, utilities
└── scripts/               # Bootstrap + dev orchestration
```

---

## ⚙️ **Environment Setup**

### **Prerequisites**
- Node.js 18+
- pnpm 8+
- Git

### **Environment Variables**
Copy `.env.example` to `.env` and configure:

```bash
# Chain (Polygon Amoy testnet)
RPC_URL=https://rpc-amoy.polygon.technology
CHAIN_ID=80002
PRIVATE_KEY=0xYOUR_TEST_KEY

# Feature Switches (Demo Mode)
MOCK_SELF=true
MOCK_NFC=true
MOCK_IPFS=true

# WalletConnect
WALLETCONNECT_PROJECT_ID=your_project_id

# Database
DATABASE_URL=file:./dev.db
```

---

## 📦 **Installation & Development**

### **One-Command Setup**
```bash
pnpm bootstrap    # Install deps + compile contracts + setup DB
pnpm dev         # Start all services
```

### **Individual Commands**
```bash
# Install all dependencies
pnpm install

# Build shared package
pnpm build:shared

# Compile smart contracts
pnpm compile:contracts

# Setup database
cd packages/web
pnpm db:push && pnpm db:seed

# Start development servers
pnpm dev:hardhat     # Local blockchain (port 8545)
pnpm dev:web         # Next.js app (port 3000)
pnpm dev:subgraph    # Mock subgraph mode
```

---

## 🔗 **Partner Integrations**

### **Self Protocol (ZK Verification)**
```typescript
// Real implementation (when MOCK_SELF=false)
const proof = await selfProtocol.generateProof({
  chipId: nfcData.chipId,
  requirements: ['female', '18+', 'hpv_vaccinated']
});

// Demo mode (MOCK_SELF=true)
// Returns mock proof for seamless judging
```

### **World App Compatibility**
- **Deep Links**: `worldcoin://mini-app?url=...`
- **Responsive UI**: Mobile-optimized for in-app usage
- **WalletConnect**: Seamless wallet connection flow

### **NFC Web API**
```typescript
// Real implementation
const ndefReader = new NDEFReader();
await ndefReader.scan();

// Demo fallback
const chipId = nfcAdapter.generateMockChipId();
```

### **The Graph Indexing**
```graphql
type Guardian @entity {
  id: ID!
  wallet: Bytes!
  chipId: Bytes!
  posts: [Post!]! @derivedFrom(field: "author")
  upvotes: [Upvote!]! @derivedFrom(field: "voter")
}
```

---

## 🧪 **Testing**

### **Smart Contract Tests**
```bash
cd packages/contracts
pnpm test
```

### **Integration Testing**
```bash
# Start local environment
pnpm dev

# Run demo script
./scripts/demo.sh
```

---

## 🚢 **Deployment**

### **Smart Contracts**
```bash
# Deploy to Polygon Amoy
cd packages/contracts
pnpm deploy --network amoy

# Deploy to World Chain
pnpm deploy --network worldchain
```

### **Frontend (Vercel)**
```bash
cd packages/web
npm run build
vercel deploy
```

### **Subgraph (The Graph)**
```bash
cd packages/subgraph
pnpm subgraph:deploy
```

---

## 🎭 **What's Real vs Mocked**

| Component | Production | Demo Mode |
|-----------|------------|-----------|
| **Smart Contracts** | ✅ Real Solidity | ✅ Real Solidity |
| **Wallet Integration** | ✅ Real WalletConnect | ✅ Real WalletConnect |
| **Self Protocol ZK** | ✅ Real SDK calls | 🎭 Mock proofs |
| **NFC Scanning** | ✅ Web NFC API | 🎭 Simulated taps |
| **IPFS Storage** | ✅ Web3.Storage | 🎭 Mock CIDs |
| **The Graph** | ✅ Real subgraph | 🎭 Local database |
| **Database** | ✅ Real Prisma + SQLite | ✅ Real Prisma + SQLite |

**🎯 Judge Note**: All core architecture is production-ready. Mocks ensure the demo runs without external API keys while showing the complete integration points.

---

## 🏆 **Hackathon Highlights**

### **Technical Innovation**
- **Zero-Knowledge Privacy**: Prove eligibility without revealing personal data
- **Multi-Modal Verification**: NFC + ZK + On-chain proof combination
- **Gasless UX**: Meta-transactions for seamless user experience
- **Cross-Chain Ready**: Deploy on Polygon, World Chain, or any EVM

### **Social Impact**
- **Anonymous Healthcare**: Safe space for sensitive women's health discussions
- **Verified Moderation**: Trust without compromising privacy
- **Community Incentives**: Reward helpful contributors
- **Global Accessibility**: Works worldwide with local clinic partnerships

### **Engineering Excellence**
- **Monorepo Architecture**: Clean separation of concerns
- **Type-Safe**: End-to-end TypeScript with shared types
- **Comprehensive Testing**: Smart contract + integration tests
- **Production Ready**: Real deployment scripts and CI/CD setup

---

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Run tests: `pnpm test`
4. Submit pull request

### **Code Standards**
- **TypeScript**: Strict mode enabled
- **Solidity**: Latest practices with OpenZeppelin
- **React**: Function components with hooks
- **Prisma**: Type-safe database operations

---

## 📄 **License**

MIT License - built for EthDelhi 2024 🇮🇳

---

## 🔗 **Links**

- **Demo**: http://localhost:3000 (after `pnpm dev`)
- **Contracts**: [Polygon Amoy Explorer](https://amoy.polygonscan.com)
- **Self Protocol**: https://selfprotocol.com
- **World App**: https://worldcoin.org/download
- **The Graph**: https://thegraph.com

---

**Built with ❤️ for women's health privacy and community empowerment**