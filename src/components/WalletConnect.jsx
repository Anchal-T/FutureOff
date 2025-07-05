import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import Button from './common/Button';

function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new injected() });
  const { disconnect } = useDisconnect();

  return (
    <div className="flex items-center space-x-4">
      {isConnected ? (
        <>
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white font-medium">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
          <Button onClick={() => disconnect()} variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
            Disconnect
          </Button>
        </>
      ) : (
        <Button 
          onClick={() => connect()} 
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          size="md"
        >
          🔗 Connect Wallet
        </Button>
      )}
    </div>
  );
}

export default WalletConnect;