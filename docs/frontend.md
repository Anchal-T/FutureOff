# Frontend Development Guide

The frontend is built with React and provides a modern, responsive interface for the Yield Optimizer platform.

## Technology Stack

- **React 19**: Main framework
- **Wagmi**: Ethereum React hooks
- **Viem**: TypeScript Ethereum library
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Ethers.js**: Ethereum library

## Project Structure

```
frontend/src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── PositionManager.jsx
│   ├── RiskMonitor.jsx
│   ├── StrategySelector.jsx
│   └── WalletConnect.jsx
├── context/            # React contexts
│   └── Web3Context.jsx
├── hooks/              # Custom React hooks
│   ├── usePositions.js
│   ├── useWeb3.js
│   └── useYields.js
├── pages/              # Page components
│   ├── DashboardPage.jsx
│   └── Home.jsx
├── styles/             # CSS files
│   ├── global.css
│   └── tailwind.css
├── utils/              # Utility functions
│   ├── api.js
│   ├── constants.js
│   └── format.js
└── assets/             # Static assets
    └── logo.svg
```

## Key Components

### WalletConnect
Handles wallet connection and authentication.

```jsx
import { WalletConnect } from './components/WalletConnect';

// Usage
<WalletConnect onConnect={handleWalletConnect} />
```

### Dashboard
Main application dashboard with key metrics.

### PositionManager
Manages user positions and portfolio.

### StrategySelector
Interface for selecting and executing strategies.

### RiskMonitor
Real-time risk monitoring and alerts.

## Custom Hooks

### useWeb3
Provides Web3 functionality and wallet state.

```javascript
const { account, isConnected, connect, disconnect } = useWeb3();
```

### usePositions
Manages user positions data.

```javascript
const { positions, loading, createPosition, closePosition } = usePositions();
```

### useYields
Fetches and manages yield data.

```javascript
const { yields, strategies, optimizeYield } = useYields();
```

## Styling Guidelines

### Tailwind CSS
Use Tailwind utility classes for styling:

```jsx
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h2 className="text-xl font-bold text-gray-800 mb-4">Title</h2>
  <p className="text-gray-600">Content</p>
</div>
```

### Color Palette
- Primary: Blue (`blue-500`, `blue-600`)
- Success: Green (`green-500`, `green-600`)
- Warning: Yellow (`yellow-500`, `yellow-600`)
- Error: Red (`red-500`, `red-600`)
- Neutral: Gray (`gray-100` to `gray-900`)

### Responsive Design
Mobile-first approach with breakpoint utilities:
- `sm:`: Small devices (640px+)
- `md:`: Medium devices (768px+)
- `lg:`: Large devices (1024px+)
- `xl:`: Extra large devices (1280px+)

## State Management

### Context API
Global state using React Context:

```javascript
// Web3Context provides wallet and blockchain state
const Web3Context = createContext();

// Usage in components
const { account, chainId, signer } = useContext(Web3Context);
```

### Local State
Component-level state with useState and useReducer for complex state.

## API Integration

### API Client
Centralized API client in `utils/api.js`:

```javascript
import { apiClient } from '../utils/api';

// Get strategies
const strategies = await apiClient.get('/strategies');

// Create position
const position = await apiClient.post('/positions', {
  strategy: 'compound-usdc',
  amount: 1000
});
```

### Error Handling
Consistent error handling across the application:

```javascript
try {
  const result = await apiCall();
  setData(result);
} catch (error) {
  setError(error.message);
  showNotification('Error occurred', 'error');
}
```

## Performance Optimization

### Code Splitting
Lazy load components and routes:

```javascript
const Dashboard = lazy(() => import('./pages/DashboardPage'));

<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

### Memoization
Use React.memo and useMemo for expensive operations:

```javascript
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => processData(data), [data]);
  return <div>{processedData}</div>;
});
```

## Testing

### Unit Tests
Test individual components with React Testing Library:

```javascript
import { render, screen } from '@testing-library/react';
import { WalletConnect } from './WalletConnect';

test('renders connect button', () => {
  render(<WalletConnect />);
  expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
});
```

### Integration Tests
Test component interactions and user flows.

## Development Workflow

1. **Setup**: `npm install` and `npm start`
2. **Development**: Make changes and test locally
3. **Testing**: Run `npm test` before committing
4. **Building**: `npm run build` for production
5. **Deployment**: Deploy build folder to hosting service

## Environment Variables

Create `.env` file in frontend directory:

```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_CHAIN_ID=1
REACT_APP_INFURA_KEY=your_infura_key
REACT_APP_ENVIRONMENT=development
```
