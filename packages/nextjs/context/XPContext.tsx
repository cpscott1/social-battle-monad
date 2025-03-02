import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

interface NFTStats {
  strength: number;
  agility: number;
  intelligence: number;
  charisma: number;
  vitality: number;
  powerLevel: number;
  baseStats: {
    strength: number;
    agility: number;
    intelligence: number;
    charisma: number;
    vitality: number;
  };
  socialBoosts: {
    strength: number;
    agility: number;
    intelligence: number;
    charisma: number;
    vitality: number;
  };
  connectedAccounts: string[];
  xp?: number;
  level?: number;
  twitterMetrics?: {
    followers: number;
    following: number;
    tweets: number;
    engagement_rate: number;
  };
}

interface XPContextType {
  nftStats: NFTStats | null;
  level: number;
  powerLevel: number;
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
  const [nftStats, setNFTStats] = useState<NFTStats | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [powerLevel, setPowerLevel] = useState<number>(0);

  // Fetch NFT stats when user is authenticated
  useEffect(() => {
    const fetchNFTStats = async () => {
      if (authenticated && user) {
        try {
          // Get list of connected accounts
          const connectedPlatforms = user.linkedAccounts.map(account => account.type);

          console.log("Connected social accounts:", connectedPlatforms);

          // Fetch stats with connected accounts
          const response = await fetch(`/api/twitter/metrics?connectedAccounts=${connectedPlatforms.join(",")}`);
          const data = await response.json();

          if (data.success) {
            console.log("Received NFT stats:", data.stats);
            setNFTStats(data.stats);
            setPowerLevel(data.stats.powerLevel);
            setLevel(Math.floor(data.stats.powerLevel / 10) + 1); // Level is powerLevel/10 rounded down + 1
          } else {
            console.log("Failed to fetch NFT stats:", data.error);
          }
        } catch (error) {
          console.error("Error fetching NFT stats:", error);
        }
      } else {
        console.log("User not authenticated or not ready:", { authenticated, ready });
      }
    };

    if (ready) {
      console.log("XP Context ready, fetching NFT stats...");
      fetchNFTStats();
    }
  }, [authenticated, user, ready]);

  return <XPContext.Provider value={{ nftStats, level, powerLevel }}>{children}</XPContext.Provider>;
};
