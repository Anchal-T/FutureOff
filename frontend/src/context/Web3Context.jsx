import React, { createContext, useContext } from 'react';
import { useAccount, useNetwork } from 'wagmi';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const value = {
    address,
    isConnected,
    chainId: chain?.id,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3Context = () => useContext(Web3Context);