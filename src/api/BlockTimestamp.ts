import axios from "axios";

export const getBlockNumbers = async (): Promise<bigint[]> => {
  const api_key = import.meta.env.VITE_ETHERSCAN_API;

  const date = new Date();

  const getFirstDay = (date: Date) => {
    const day = 1;
    let month = date.getMonth() - 1;
    let year = date.getFullYear();

    if (month < 0) {
      year--;
      month = 11;
    }

    return new Date(year, month, day);
  };

  let first = new Date(date.getFullYear(), date.getMonth(), 1);
  const second = getFirstDay(new Date());
  const third = getFirstDay(second);
  const fourth = getFirstDay(third);

  let dateArray = [first, second, third, fourth];
  let timeStampArray: bigint[] = [];

  for (let i = 0; i < dateArray.length; i++) {
    let unix = Math.floor(dateArray[i].getTime() / 1000);

    let { data } = await axios({
      method: "GET",
      url: `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${unix}&closest=before&apikey=${api_key}`,
    });

    timeStampArray.push(BigInt(data.result));
  }

  console.log(timeStampArray);

  return timeStampArray;
};
