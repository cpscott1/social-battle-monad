import { monadTestnet } from "../customChains";
import { createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";

// Using the existing monadTestnet chain from your setup
export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http("https://testnet-rpc.monad.xyz"),
  },
});
