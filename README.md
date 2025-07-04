# Yield Farming Optimization Agent - Frontend

A React-based frontend for the Yield Farming Optimization Agent, built with Wagmi, Ethers.js, Axios, and Tailwind CSS.

## Setup

1. Install dependencies:
   ```bash
   npm install
   npm install wagmi ethers@5 axios --legacy-peer-deps
   npm install -D tailwindcss postcss autoprefixer --legacy-peer-deps
   npx tailwindcss init -p

2. Configure environment variables in .env:

REACT_APP_BACKEND_API_URL=http://localhost:3000
REACT_APP_ALCHEMY_API_KEY=your-alchemy-api-key


---

## Step 3: Setup Instructions

1. **Create the File Structure**:
   - Navigate to `C:\Users\jayan\OneDrive\Documents\FutureOff\FutureOff\frontend`.
   - Create the directories and files as listed above (e.g., `mkdir src\components`, `mkdir src\components\common`, etc.).
   - Copy the provided file contents into each file.

2. **Update Alchemy API Key**:
   - Replace `YOUR_ALCHEMY_API_KEY` in `src/App.jsx` with your actual Alchemy API key for Sepolia testnet (get it from [alchemy.com](https://www.alchemy.com/)).
   - Add the key to `.env`:
     ```env
     REACT_APP_ALCHEMY_API_KEY=your-alchemy-api-key