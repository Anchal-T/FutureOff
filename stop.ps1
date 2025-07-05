# Stop all Node.js processes to free up ports
Write-Host "🛑 Stopping all Node.js processes..." -ForegroundColor Red

# Kill all node processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "✅ All Node.js processes stopped" -ForegroundColor Green
Write-Host "🚀 You can now run npm run dev or .\start.ps1" -ForegroundColor Cyan
