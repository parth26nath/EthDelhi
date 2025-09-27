#!/bin/bash

set -e

echo "🚀 HPV Warriors DAO - Development Servers"
echo "========================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run 'pnpm bootstrap' first."
    exit 1
fi

# Load environment variables
source .env

echo "🔗 Starting Hardhat local node..."
cd packages/contracts
pnpm hardhat node &
HARDHAT_PID=$!
cd ../..

echo "⏳ Waiting for Hardhat node to start..."
sleep 5

echo "📄 Deploying contracts..."
cd packages/contracts
pnpm hardhat run scripts/deploy.ts --network localhost
cd ../..

echo "🌐 Starting Next.js development server..."
cd packages/web
pnpm dev &
WEB_PID=$!
cd ../..

echo ""
echo "✅ Development servers started!"
echo ""
echo "🔗 Services:"
echo "   Hardhat Node: http://localhost:8545"
echo "   Web App: http://localhost:3000"
echo ""
echo "📊 Demo Features Available:"
echo "   • Connect wallet (WalletConnect or MetaMask)"
echo "   • Simulate NFC chip scanning"
echo "   • Generate mock ZK proofs"
echo "   • Create anonymous posts"
echo "   • Upvote posts"
echo "   • View leaderboard"
echo "   • Admin functions (register clinics, allocate rewards)"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup processes
cleanup() {
    echo ""
    echo "🛑 Stopping development servers..."
    kill $HARDHAT_PID 2>/dev/null || true
    kill $WEB_PID 2>/dev/null || true
    echo "✅ All servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user input to keep script running
wait