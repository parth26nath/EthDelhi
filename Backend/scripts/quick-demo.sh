#!/bin/bash

echo "🚀 HPV Warriors DAO - Quick Demo Setup"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed. Installing...${NC}"
    npm install -g pnpm
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install

echo -e "${BLUE}🔨 Building shared package...${NC}"
pnpm --filter shared build

echo -e "${BLUE}📄 Compiling smart contracts...${NC}"
pnpm --filter contracts compile

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cp .env.example .env
fi

# Check if web .env.local exists
if [ ! -f packages/web/.env.local ]; then
    echo -e "${YELLOW}📝 Creating web .env.local file...${NC}"
    cp packages/web/.env.local.example packages/web/.env.local
fi

echo -e "${BLUE}🏗️ Setting up database...${NC}"
cd packages/web
pnpm db:push
pnpm db:seed
cd ../..

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}🎯 Next steps:${NC}"
echo "1. Run 'pnpm dev' to start all services"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Follow the 12-minute demo script in the README"
echo ""
echo -e "${BLUE}📋 Quick Demo Checklist:${NC}"
echo "[ ] 1. Register clinic (admin page)"
echo "[ ] 2. Verify as guardian (NFC + ZK)"
echo "[ ] 3. Create anonymous post"
echo "[ ] 4. Upvote from second wallet"
echo "[ ] 5. View leaderboard"
echo "[ ] 6. Allocate rewards"
echo ""
echo -e "${GREEN}🎉 Ready to demo! Good luck at EthDelhi! 🇮🇳${NC}"