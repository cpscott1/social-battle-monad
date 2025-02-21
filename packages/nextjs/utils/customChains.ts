import { defineChain, http } from "viem";

// TODO: Add Chain details here.
export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad Testnet", symbol: "MON", decimals: 18 },
  iconUrl: "https://miro.medium.com/v2/resize:fit:400/0*aRHYdVg5kllfc7Gn.jpg",
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.monad.xyz/"],
    },
    public: {
      http: ["https://testnet-rpc.monad.xyz/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Testnet",
      url: "https://monad-testnet.socialscan.io/",
    },
  },
  testnet: true,
});

export const chainArray = [monadTestnet];
export const transportsObject = {
  [monadTestnet.id]: http(),
};
