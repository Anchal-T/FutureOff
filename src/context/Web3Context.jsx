import React, { createContext, useContext } from 'react';
import { useAccount, useChainId } from 'wagmi';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const value = {
    address,
    isConnected,
    chainId,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3Context = () => useContext(Web3Context);
