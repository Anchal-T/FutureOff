# FutureOff Yield Optimizer - Quick Start Script (PowerShell)
Write-Host "🚀 Starting FutureOff Yield Optimizer..." -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm run install-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
}

# Start both frontend and backend
Write-Host "🌟 Starting frontend and backend servers..." -ForegroundColor Magenta
Write-Host "📱 Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend will be available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host "⏹️  Press Ctrl+C to stop both servers" -ForegroundColor Yellow

npm run dev
