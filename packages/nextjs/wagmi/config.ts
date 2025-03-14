import { createConfig, http } from "wagmi";
import { monad } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [monad],
  transports: {
    [monad.id]: http(),
  },
});
