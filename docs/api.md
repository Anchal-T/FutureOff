# API Reference

The Yield Optimizer backend provides a RESTful API for interacting with the platform.

## Base URL
```
Development: http://localhost:3001/api
Production: https://api.yield-optimizer.com/api
```

## Authentication
Currently using API key authentication. Include the API key in the header:
```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Strategies

#### GET /strategies
Get all available yield strategies.

**Response:**
```json
{
  "strategies": [
    {
      "id": "compound-usdc",
      "name": "Compound USDC Lending",
      "protocol": "compound",
      "token": "USDC",
      "apy": 5.2,
      "risk": "low",
      "tvl": 1000000
    }
  ]
}
```

#### GET /strategies/:id
Get details for a specific strategy.

#### POST /strategies/optimize
Find optimal strategies for given parameters.

**Request Body:**
```json
{
  "amount": 1000,
  "token": "USDC",
  "riskTolerance": "medium",
  "duration": 30
}
```

### Positions

#### GET /positions/:address
Get all positions for a wallet address.

#### POST /positions
Create a new position.

#### PUT /positions/:id
Update an existing position.

#### DELETE /positions/:id
Close a position.

### Analytics

#### GET /analytics/performance
Get performance metrics.

#### GET /analytics/risk
Get risk assessment data.

#### GET /analytics/yields
Get historical yield data.

### Blockchain

#### GET /blockchain/gas
Get current gas prices across networks.

#### POST /blockchain/simulate
Simulate a transaction before execution.

## Error Handling

The API uses standard HTTP status codes:
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

Error responses include a message:
```json
{
  "error": "Invalid strategy ID",
  "code": "INVALID_STRATEGY"
}
```

## Rate Limiting

- 100 requests per minute per API key
- 1000 requests per hour per API key
- Burst limit: 10 requests per second

## WebSocket Events

Real-time updates via WebSocket connection:

### Connection
```javascript
const ws = new WebSocket('ws://localhost:3001/ws');
```

### Events
- `position_updated`: Position status changed
- `yield_opportunity`: New yield opportunity found
- `price_alert`: Token price threshold reached
- `risk_alert`: Risk level changed
