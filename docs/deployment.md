# Deployment Guide

This guide covers how to deploy the Yield Optimizer platform to various environments.

## Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git
- Docker (optional)
- Domain name and SSL certificate (production)

## Environment Setup

### 1. Development Environment

```bash
# Clone repository
git clone https://github.com/your-username/yield-optimizer.git
cd yield-optimizer

# Install dependencies
npm run install:all

# Copy environment files
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp smart-contracts/.env.example smart-contracts/.env

# Configure environment variables
# Edit each .env file with your specific values

# Start development
npm start
```

### 2. Smart Contract Deployment

#### Local Network (Hardhat)
```bash
cd smart-contracts
npx hardhat node  # Start local blockchain
npm run deploy:local  # Deploy contracts
```

#### Testnet Deployment
```bash
cd smart-contracts
npm run deploy:goerli  # Goerli testnet
npm run deploy:mumbai  # Mumbai testnet
```

#### Mainnet Deployment
```bash
cd smart-contracts
npm run deploy:ethereum  # Ethereum mainnet
npm run deploy:polygon   # Polygon mainnet
npm run deploy:arbitrum  # Arbitrum mainnet
npm run deploy:optimism  # Optimism mainnet
```

### 3. Backend Deployment

#### Using PM2 (Production)
```bash
# Install PM2 globally
npm install -g pm2

# Deploy backend
cd backend
npm run build  # If build step exists
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Using Docker
```bash
# Build backend image
cd backend
docker build -t yield-optimizer-backend .

# Run container
docker run -d \
  --name yield-optimizer-backend \
  -p 3001:3001 \
  --env-file .env \
  yield-optimizer-backend
```

### 4. Frontend Deployment

#### Build for Production
```bash
cd frontend
npm run build
```

#### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod --dir=build
```

#### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

#### Deploy to AWS S3 + CloudFront
```bash
# Build application
cd frontend
npm run build

# Upload to S3 bucket
aws s3 sync build/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## Infrastructure Setup

### 1. Database Setup

#### SQLite (Development)
Default configuration works out of the box.

#### PostgreSQL (Production)
```sql
-- Create database
CREATE DATABASE yield_optimizer;

-- Create user
CREATE USER yield_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE yield_optimizer TO yield_user;
```

Update backend `.env`:
```
DB_URL=postgresql://yield_user:secure_password@localhost:5432/yield_optimizer
```

### 2. Redis Setup (Optional - for caching)
```bash
# Install Redis
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis
sudo systemctl enable redis
```

### 3. Nginx Configuration
```nginx
# /etc/nginx/sites-available/yield-optimizer
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/yield-optimizer-frontend;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /ws {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Logging

### 1. Application Monitoring
- **Sentry**: Error tracking and performance monitoring
- **New Relic**: Application performance monitoring
- **DataDog**: Infrastructure and application monitoring

### 2. Log Management
```bash
# Configure log rotation
sudo nano /etc/logrotate.d/yield-optimizer

# Content:
/var/log/yield-optimizer/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload yield-optimizer
    endscript
}
```

### 3. Health Checks
Create health check endpoints:
- `/api/health`: Backend health
- `/health.html`: Frontend health

## Security Checklist

### Smart Contracts
- [ ] Security audit completed
- [ ] Multi-sig wallet for admin functions
- [ ] Time locks on critical operations
- [ ] Emergency pause mechanism tested

### Backend
- [ ] Environment variables secured
- [ ] API rate limiting configured
- [ ] Input validation implemented
- [ ] SQL injection protection
- [ ] CORS properly configured

### Frontend
- [ ] Content Security Policy (CSP)
- [ ] Secure headers configured
- [ ] XSS protection enabled
- [ ] HTTPS enforced

### Infrastructure
- [ ] Firewall configured
- [ ] SSH key authentication
- [ ] Regular security updates
- [ ] Backup strategy implemented
- [ ] Monitoring alerts configured

## Backup and Recovery

### 1. Database Backup
```bash
# PostgreSQL backup
pg_dump yield_optimizer > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated backup script
#!/bin/bash
BACKUP_DIR="/var/backups/yield-optimizer"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump yield_optimizer > $BACKUP_DIR/db_backup_$DATE.sql
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +30 -delete
```

### 2. Application Backup
```bash
# Backend application backup
tar -czf backend_backup_$(date +%Y%m%d).tar.gz /opt/yield-optimizer-backend

# Frontend backup
tar -czf frontend_backup_$(date +%Y%m%d).tar.gz /var/www/yield-optimizer-frontend
```

## Performance Optimization

### 1. Frontend Optimization
- Enable gzip compression
- Implement CDN for static assets
- Optimize images and assets
- Enable browser caching
- Code splitting and lazy loading

### 2. Backend Optimization
- Database query optimization
- Connection pooling
- Caching strategy (Redis)
- API response compression
- Load balancing (if needed)

### 3. Smart Contract Optimization
- Gas optimization
- Batch operations
- Efficient storage patterns
- Proxy patterns for upgrades

## Troubleshooting

### Common Issues

#### Contract Deployment Fails
- Check gas limit and gas price
- Verify RPC URL connectivity
- Ensure sufficient ETH balance
- Check for compilation errors

#### Backend Won't Start
- Verify environment variables
- Check database connectivity
- Review log files
- Ensure ports are available

#### Frontend Build Fails
- Clear node_modules and reinstall
- Check for dependency conflicts
- Verify environment variables
- Review build logs

### Log Locations
- Backend: `/var/log/yield-optimizer/backend.log`
- Nginx: `/var/log/nginx/error.log`
- PM2: `~/.pm2/logs/`
