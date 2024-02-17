import axios from "axios";
import { getBalance, GetBalanceParameters } from "@wagmi/core";
import { useAccount, useBalance } from "wagmi";
import { config } from "./config";

export const getTokens = async (): Promise<Token[]> => {
  let { data: addressReference } = await axios({
    method: "GET",
    url: "https://api.coingecko.com/api/v3/coins/list?include_platform=true",
  });

  let { data: topOneHundredTokens } = await axios({
    method: "GET",
    url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=ethereum-ecosystem&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en",
  });

  const payload = [];
  const { address } = useAccount();

  if (!address) {
    throw new Error("No wallet connected");
  }

  for (const token of topOneHundredTokens) {
    const data = addressReference.find((tokenData: any) => {
      return token.id === tokenData.id;
    });
    if (data) {
      const balance = await getBalance(config, {
        address,
        token: token.platforms.ethereum,
      });

      payload.push({ ...token, ...data, ...balance });
    }
  }

  console.log(payload);
  return payload;
};

export interface Token {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any;
  last_updated: string;
  platforms: Platforms;
}

export interface Platforms {
  ethereum: string;
}
