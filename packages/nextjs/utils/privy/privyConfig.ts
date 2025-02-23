import { monadTestnet } from "../customChains";
import { PrivyClientConfig } from "@privy-io/react-auth";

export const privyConfig: PrivyClientConfig = {
  loginMethods: ["twitter", "discord"],
  supportedChains: [monadTestnet],
  appearance: {
    theme: "dark" as const,
    accentColor: "#3CFF97", // Using existing accent color
    showWalletLoginFirst: false, // Show social login options first
  },
};
