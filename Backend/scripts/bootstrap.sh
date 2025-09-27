#!/bin/bash

set -e

echo "🚀 HPV Warriors DAO - Bootstrap Script"
echo "======================================"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Check if .env exists, if not copy from .env.example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ Please edit .env file with your configuration"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🔨 Building shared package..."
pnpm --filter shared build

echo ""
echo "📄 Compiling smart contracts..."
pnpm --filter contracts compile

echo ""
echo "🏗️ Setting up database..."
cd packages/web
pnpm db:push
pnpm db:seed
cd ../..

echo ""
echo "✅ Bootstrap completed!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Run 'pnpm dev' to start the development servers"
echo ""
echo "🎯 Happy hacking!"