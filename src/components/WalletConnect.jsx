import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import Button from './common/Button';

function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new injected() });
  const { disconnect } = useDisconnect();

  return (
    <div className="mb-4">
      {isConnected ? (
        <div className="flex items-center space-x-4">
          <p className="text-sm">Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
          <Button onClick={() => disconnect()}>Disconnect</Button>
        </div>
      ) : (
        <Button onClick={() => connect()}>Connect Wallet</Button>
      )}
    </div>
  );
}

export default WalletConnect;