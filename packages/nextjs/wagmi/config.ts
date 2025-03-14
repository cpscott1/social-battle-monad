import { defineChain } from "viem";
import { createConfig, http } from "wagmi";

// Define Monad chain
export const monad = defineChain({
  id: 10143, // Monad Testnet ID
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Monad",
    symbol: "MON", // Correct testnet symbol
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.monad.xyz/"],
    },
    public: {
      http: ["https://rpc.monad.xyz/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: "https://explorer.monad.xyz",
    },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [monad],
  transports: {
    [monad.id]: http(),
  },
});
