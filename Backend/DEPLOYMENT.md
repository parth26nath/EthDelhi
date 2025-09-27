# Deployment Guide

## Quick Start for Judges

```bash
git clone <repo-url>
cd hpv-warriors
./scripts/quick-demo.sh
pnpm dev
```

Open http://localhost:3000 and follow the 12-minute demo script.

## Production Deployment

### 1. Smart Contracts

#### Polygon Amoy Testnet
```bash
cd packages/contracts
cp .env.example .env
# Edit .env with your values
pnpm deploy --network amoy
```

#### World Chain
```bash
# Update hardhat.config.ts with World Chain RPC
pnpm deploy --network worldchain
```

### 2. Frontend (Vercel)

```bash
cd packages/web
npm run build
vercel deploy --prod
```

Environment variables for Vercel:
```
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_MOCK_SELF=false
NEXT_PUBLIC_MOCK_NFC=false
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
DATABASE_URL=your_production_db_url
SELF_PROTOCOL_API_KEY=your_self_key
WEB3_STORAGE_TOKEN=your_web3_storage_token
```

### 3. The Graph Subgraph

```bash
cd packages/subgraph
# Update subgraph.yaml with deployed contract addresses
pnpm subgraph:build
pnpm subgraph:deploy
```

### 4. Database (Production)

For production, replace SQLite with PostgreSQL:

```bash
# Update DATABASE_URL in .env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Run migrations
cd packages/web
pnpm db:push
```

## Environment Configuration

### Development (.env)
```bash
RPC_URL=http://127.0.0.1:8545
CHAIN_ID=31337
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
MOCK_SELF=true
MOCK_NFC=true
MOCK_IPFS=true
```

### Testnet (.env)
```bash
RPC_URL=https://rpc-amoy.polygon.technology
CHAIN_ID=80002
PRIVATE_KEY=0xYOUR_TESTNET_PRIVATE_KEY
MOCK_SELF=true
MOCK_NFC=true
MOCK_IPFS=true
WALLETCONNECT_PROJECT_ID=your_project_id
```

### Production (.env)
```bash
RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
CHAIN_ID=137
PRIVATE_KEY=0xYOUR_PRODUCTION_PRIVATE_KEY
MOCK_SELF=false
MOCK_NFC=false
MOCK_IPFS=false
WALLETCONNECT_PROJECT_ID=your_project_id
SELF_PROTOCOL_API_KEY=your_self_key
WEB3_STORAGE_TOKEN=your_web3_storage_token
```

## Partner Service Integration

### Self Protocol
```typescript
// packages/web/lib/selfAdapter.ts
// Update with real Self Protocol SDK integration
const selfClient = new SelfClient(process.env.SELF_PROTOCOL_API_KEY);
```

### NFC Integration
```typescript
// packages/web/lib/nfc.ts
// Already implements Web NFC API - just set MOCK_NFC=false
```

### World App
```typescript
// packages/web/components/WorldAppButton.tsx
// Update with your World App configuration
const deepLink = `worldcoin://mini-app?url=${encodeURIComponent(window.location.origin)}`;
```

## Monitoring & Analytics

### Contract Events
Monitor these key events:
- `GuardianNFTMinted` - New guardians
- `PostCreated` - New posts
- `PostUpvoted` - Community engagement
- `RewardAllocated` - Reward distribution

### The Graph Queries
```graphql
{
  guardians(first: 10, orderBy: timestamp, orderDirection: desc) {
    id
    wallet
    timestamp
  }

  posts(first: 20, orderBy: createdAt, orderDirection: desc) {
    id
    author
    upvotes
    createdAt
  }
}
```

## Security Considerations

### Smart Contracts
- ✅ OpenZeppelin base contracts
- ✅ ReentrancyGuard on reward claims
- ✅ Access control (Ownable)
- ✅ Input validation

### Frontend
- ✅ Environment variable security
- ✅ Input sanitization
- ✅ Wallet connection security
- ✅ HTTPS enforcement

### Privacy
- ✅ Anonymous posting
- ✅ ZK proof verification
- ✅ No PII storage
- ✅ Wallet-only identification

## Scaling Considerations

### Layer 2 Solutions
- **Polygon**: Lower gas costs, faster transactions
- **World Chain**: Optimized for identity verification
- **Arbitrum**: Alternative L2 option

### Database Optimization
- Index frequently queried fields
- Implement caching for leaderboard
- Use read replicas for analytics

### CDN & Performance
- Use Vercel Edge Functions
- Implement image optimization
- Cache static assets

## Troubleshooting

### Common Issues

**"Contract not deployed"**
```bash
cd packages/contracts
pnpm deploy
```

**"Database connection failed"**
```bash
cd packages/web
pnpm db:push
```

**"NFC not supported"**
- Enable MOCK_NFC=true for demo
- Test on mobile devices for real NFC

**"Self Protocol error"**
- Enable MOCK_SELF=true for demo
- Check API key configuration

### Debug Mode
```bash
export DEBUG=hpv-warriors:*
pnpm dev
```

## Support

For deployment issues:
1. Check the GitHub Issues
2. Review environment variables
3. Verify contract addresses
4. Test with mock modes first

Built for EthDelhi 2024 🇮🇳