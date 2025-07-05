#!/bin/bash

# FutureOff Yield Optimizer - Quick Start Script (Bash)
echo "🚀 Starting FutureOff Yield Optimizer..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js version: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm version: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm run install-deps
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
fi

npm run dev
