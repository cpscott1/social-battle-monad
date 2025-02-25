import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePrivy } from "@privy-io/react-auth";

interface XPContextType {
  xp: number;
  level: number;
  addXP: (amount: number) => void;
  setXP: (amount: number) => void;
}

const XPContext = createContext<XPContextType | undefined>(undefined);

export const useXP = () => {
  const context = useContext(XPContext);
  if (context === undefined) {
    throw new Error("useXP must be used within an XPProvider");
  }
  return context;
};

interface XPProviderProps {
  children: ReactNode;
}

export const XPProvider: React.FC<XPProviderProps> = ({ children }) => {
  const { ready, authenticated, user } = usePrivy();
  const [xp, setXpState] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);

  // Calculate level based on XP
  const calculateLevel = (xpPoints: number): number => {
    return Math.floor(xpPoints / 100) + 1;
  };

  // Set XP and recalculate level
  const setXP = (amount: number) => {
    setXpState(amount);
    setLevel(calculateLevel(amount));
  };

  // Add XP and recalculate level
  const addXP = (amount: number) => {
    const newXP = xp + amount;
    setXpState(newXP);
    setLevel(calculateLevel(newXP));
  };

  // Initialize XP from storage or API when user is authenticated
  useEffect(() => {
    if (authenticated && user) {
      // In a real implementation, you would fetch the user's XP from your backend or smart contract
      // For now, we'll use localStorage to persist XP between sessions
      const storedXP = localStorage.getItem(`xp_${user.id}`);
      if (storedXP) {
        const parsedXP = parseInt(storedXP, 10);
        setXP(parsedXP);
      } else {
        // Mock initial XP for new users
        const initialXP = Math.floor(Math.random() * 500);
        setXP(initialXP);
      }
    }
  }, [authenticated, user]);

  // Save XP to storage when it changes
  useEffect(() => {
    if (authenticated && user && xp > 0) {
      localStorage.setItem(`xp_${user.id}`, xp.toString());
    }
  }, [xp, authenticated, user]);

  return (
    <XPContext.Provider value={{ xp, level, addXP, setXP }}>
      {children}
    </XPContext.Provider>
  );
}; 