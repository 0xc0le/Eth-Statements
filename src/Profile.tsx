import { useAccount, useBalance } from "wagmi";

export function Profile() {
  const { address } = useAccount();
  const balance = useBalance({
    address: address,
  });

  console.log(balance);

  const walletData = `Address: ${address} Balance: ${balance.data?.formatted}`;

  return <div>{walletData}</div>;
}
