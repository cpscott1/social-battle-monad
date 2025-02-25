import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { Chain } from "viem";
import { http } from "wagmi";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const allowedNetworks = getTargetNetworks() as Chain[];

export const wagmiConfig = getDefaultConfig({
  appName: "Social Battle",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  chains: allowedNetworks,
  transports: {
    [allowedNetworks[0].id]: http(),
  },
});
