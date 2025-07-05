# FutureOff Yield Optimizer

An AI-powered DeFi yield optimization platform that automatically finds and executes the best yield farming strategies across multiple protocols.

## Features

- **AI-Powered Strategy Optimization**: Uses Gemini AI to analyze market conditions and recommend optimal yield strategies
- **Real-time Risk Monitoring**: Continuous monitoring of portfolio risk metrics and market volatility
- **Multi-Protocol Support**: Integrates with major DeFi protocols like Aave, Compound, Uniswap, etc.
- **Smart Contract Integration**: Automated strategy execution through custom smart contracts
- **Web3 Wallet Integration**: Connect with MetaMask and other Web3 wallets
- **Portfolio Management**: Track positions, execution history, and performance metrics

## Tech Stack

### Frontend
- React 19.1.0
- Tailwind CSS for styling
- Wagmi & Viem for Web3 integration
- React Router for navigation
- Axios for API communication

### Backend
- Node.js with Express.js
- SQLite database for data persistence
- Ethers.js for blockchain interaction
- Google Gemini AI for strategy optimization
- Node-cron for scheduled tasks

### Smart Contracts
- Solidity smart contracts
- Hardhat development environment
- OpenZeppelin libraries
- Deployed on Ethereum Sepolia testnet

## Project Structure

```
FutureOff/
├── backend/                 # Backend API server
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   ├── jobs/               # Background jobs
│   ├── config/             # Configuration files
│   └── data/               # Database and data files
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── context/            # React context providers
│   └── utils/              # Utility functions
├── contracts/              # Smart contracts
├── test/                   # Test files
└── public/                 # Static assets
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask or another Web3 wallet
- Alchemy API key (for Ethereum RPC)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FutureOff
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   npm run install-deps
   ```
   Or manually:
   ```bash
   npm install
   cd backend && npm install
   ```

3. **Environment Configuration**
   
   Create `.env` file in the root directory:
   ```env
   REACT_APP_BACKEND_API_URL=http://localhost:3001
   REACT_APP_ALCHEMY_API_KEY=your_alchemy_api_key
   REACT_APP_ENVIRONMENT=development
   ```

   Create `.env` file in the backend directory:
   ```env
   PORT=3001
   NODE_ENV=development
   SIMULATION_MODE=true
   GEMINI_API_KEY=your_gemini_api_key
   PRIVATE_KEY=your_wallet_private_key
   RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_key
   YIELD_OPTIMIZER_ADDRESS=your_deployed_contract_address
   STRATEGY_MANAGER_ADDRESS=your_deployed_contract_address
   ```

### Running the Application

#### Option 1: Run both frontend and backend together
```bash
npm run dev
```

#### Option 2: Run separately
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend (in a new terminal)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## API Endpoints

### Strategies
- `GET /api/strategies` - List all available strategies
- `GET /api/strategies/:id` - Get specific strategy details
- `POST /api/strategies/:id/execute` - Execute a strategy
- `POST /api/strategies/optimize` - Trigger strategy optimization

### Protocols
- `GET /api/protocols` - List available DeFi protocols

### Monitoring
- `GET /api/execution-history` - Get execution history
- `GET /api/simulation-logs` - Get simulation logs
- `GET /api/status` - Get system status

## Usage

1. **Connect Your Wallet**: Click the "Connect Wallet" button and approve the connection
2. **View Available Strategies**: The dashboard will show optimized yield strategies
3. **Execute Strategies**: Select a strategy and amount, then execute it
4. **Monitor Positions**: Track your active positions and their performance
5. **Risk Management**: Monitor risk metrics and system logs

## Smart Contract Deployment

The application uses custom smart contracts for automated strategy execution:

- **YieldOptimizer.sol**: Main contract for yield optimization logic
- **StrategyManager.sol**: Manages strategy execution and position tracking

To deploy contracts:
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

## Development

### Running Tests
```bash
# Frontend tests
npm test

# Smart contract tests
npx hardhat test
```

## Security

- Never commit private keys or sensitive API keys
- Use environment variables for all configuration
- Test thoroughly in simulation mode before live deployment
- Monitor smart contract interactions for unusual activity

## Step 3: Setup Instructions

1. **Create the File Structure**:
   - Navigate to `C:\Users\jayan\OneDrive\Documents\FutureOff\FutureOff\frontend`.
   - Create the directories and files as listed above (e.g., `mkdir src\components`, `mkdir src\components\common`, etc.).
   - Copy the provided file contents into each file.

2. **Update Alchemy API Key**:
   - Replace `J5OB6jOnqBqmPzxhWdBmNa_mHbNXEqLy` in `src/App.jsx` with your actual Alchemy API key for Sepolia testnet (get it from [alchemy.com](https://www.alchemy.com/)).
   - Add the key to `.env`:
     ```env
     REACT_APP_ALCHEMY_API_KEY=your-alchemy-api-key