import { useEffect } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiConfig } from "wagmi";
import { config } from "~~/wagmi/config";

export const PrivyProviderWithWagmi = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Clear local storage on load
      window.localStorage.clear();
    }
  }, []);

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        loginMethods: ["email", "wallet"],
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
          showWalletLoginFirst: true,
        },
        defaultChainId: 10143,
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        redirectUrl: typeof window !== "undefined" ? window.location.origin : undefined,
      }}
    >
      <WagmiConfig config={config}>{children}</WagmiConfig>
    </PrivyProvider>
  );
};
