import { http, createConfig } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";
import { walletConnect } from "@wagmi/connectors";

const projectId = "27c44cd428a14dc4483a860ca08ba136";

export const config = createConfig({
  chains: [mainnet],
  connectors: [walletConnect({ projectId })],
  transports: {
    [mainnet.id]: http(),
  },
});
