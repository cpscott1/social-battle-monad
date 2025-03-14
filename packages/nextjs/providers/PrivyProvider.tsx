import { ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiConfig } from "wagmi";

interface PrivyProviderWrapperProps {
  children: ReactNode;
  wagmiConfig: any;
}

export const PrivyProviderWrapper = ({ children, wagmiConfig }: PrivyProviderWrapperProps) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          loginMethods: ["email", "wallet"],
          appearance: {
            theme: "dark",
            accentColor: "#676FFF",
            logo: "https://your-logo-url.com",
          },
        }}
      >
        {children}
      </PrivyProvider>
    </WagmiConfig>
  );
};
