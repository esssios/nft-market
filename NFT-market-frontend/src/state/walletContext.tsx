import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// 定义上下文类型
interface WalletContextType {
  // 这里可以定义上下文中的状态或其他属性
  walletAddress: string;
  setWallet: (walletAddress: string) => void;
}
const walletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: {children: ReactNode}) {
  const [walletAddress, setWallet] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
        } else {
          setWallet("");
        }
      });
    }
  }, []);

  return (
    <walletContext.Provider value={{ walletAddress, setWallet }}>
      {children}
    </walletContext.Provider>
  );
}

export function useWallet() {
  return useContext(walletContext);
}