import { PrivyProviderWrapper } from "../providers/PrivyProvider";
import { wagmiConfig } from "../wagmi/config";

// You'll need to create this

function MyApp({ Component, pageProps }) {
  return (
    <PrivyProviderWrapper wagmiConfig={wagmiConfig}>
      <Component {...pageProps} />
    </PrivyProviderWrapper>
  );
}

export default MyApp;
