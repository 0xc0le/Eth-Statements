import { WagmiProvider, useAccount } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./App.css";
import { getTokens } from "./api/Tokens";
import { config } from "./config";
import { Account } from "./components/account";
import { WalletOptions } from "./components/wallet-options";

const queryClient = new QueryClient();

function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectWallet />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

setTimeout(() => {
  getTokens();
}, 1000);

export default App;
