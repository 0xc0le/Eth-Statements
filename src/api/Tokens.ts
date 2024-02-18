import axios from "axios";
import { getBalance, getAccount } from "@wagmi/core";
import { config } from "../config";
import { getBlockNumbers } from "./BlockTimestamp";

export const getTokens = async (): Promise<TokenData[]> => {
  const address = getAccount(config).address;
  console.log(address);

  const api_key = import.meta.env.VITE_COINGECKO_API;

  let { data: addressReference } = await axios({
    method: "GET",
    url: `https://api.coingecko.com/api/v3/coins/list?include_platform=true&x_cg_demo_api_key=${api_key}`,
  });

  let { data: topOneHundredTokens } = await axios({
    method: "GET",
    url: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=ethereum-ecosystem&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en&x_cg_demo_api_key=${api_key}`,
  });

  const payload = [];
  const timestampArray = await getBlockNumbers();

  if (!address) {
    throw new Error("No wallet connected");
  }

  for (const token of topOneHundredTokens) {
    const data = addressReference.find((tokenData: any) => {
      return token.id === tokenData.id;
    });

    if (data) {
      let balances: Balance[] = [];
      try {
        for (const timestamp of timestampArray) {
          const balance = await getBalance(config, {
            address,
            token: data.platforms.ethereum,
            blockNumber: timestamp,
          });
          if (balance) {
            balances.push(balance);
          }
        }
      } catch (e) {
        // do nothing
      }
      payload.push({ token, data, balances });
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
}

export interface Balance {
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
}

export interface Data {
  id: string;
  name: string;
  platforms: Platforms;
  symbol: string;
}

export interface Platforms {
  ethereum: string;
}

export interface TokenData {
  token: Token;
  balances: Balance[];
  data: Data;
}
