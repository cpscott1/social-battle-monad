import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { privyConfig } from "~~/utils/privy/privyConfig";

const queryClient = new QueryClient();

export const PrivyProviderWithWagmi = ({ children }: { children: React.ReactNode }) => {
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    throw new Error("NEXT_PUBLIC_PRIVY_APP_ID environment variable is not set");
  }

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        ...privyConfig,
        loginMethods: ["email", "wallet", "google", "twitter", "discord"],
        appearance: {
          theme: "dark" as const,
          accentColor: "#3CFF97",
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        onError: error => {
          console.error("Error during login:", error);
        },
        redirectUrl: typeof window !== "undefined" ? window.location.origin : undefined,
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </PrivyProvider>
  );
};
