import axios from "axios";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Profile } from "./Profile";
import "./App.css";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, polygon, optimism, arbitrum, base, zora],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const getTokens = async () => {
  let { data: addressReference } = await axios({
    method: "GET",
    url: "https://api.coingecko.com/api/v3/coins/list?include_platform=true",
  });

  let { data: topOneHundredTokens } = await axios({
    method: "GET",
    url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=ethereum-ecosystem&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en",
  });

  const payload = [];

  for (const token of topOneHundredTokens) {
    const data = addressReference.find((tokenData: any) => {
      return token.id === tokenData.id;
    });
    if (data) {
      payload.push({ ...token, ...data });
    }
  }

  console.log(payload);
};

getTokens();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConnectButton />
          <Profile />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
