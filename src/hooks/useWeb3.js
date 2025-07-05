import { useAccount, useChainId} from 'wagmi';

const useWeb3 = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useChainId();

  return {
    address,
    isConnected,
    chainId: chain?.id,
    isSepolia: chain?.id === 11155111, // Sepolia chain ID
  };
};

export default useWeb3;