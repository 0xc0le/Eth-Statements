import { useAccount } from "wagmi";

export function Profile() {
  const { address } = useAccount();
  return { address };
}
