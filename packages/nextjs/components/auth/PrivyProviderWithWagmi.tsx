import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { privyConfig } from "~~/utils/privy/privyConfig";

const queryClient = new QueryClient();

export const PrivyProviderWithWagmi = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        ...privyConfig,
        loginMethods: ["twitter", "discord"],
        appearance: {
          theme: "dark" as const,
          accentColor: "#3CFF97",
          showWalletLoginFirst: false,
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
