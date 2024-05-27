import { Reserve } from "@/common/types/types";

const getAssetPair = (reserves: Reserve[]) => {
  const assets = reserves.map((reserve: Reserve) => reserve.asset);
  const mainAsset = assets[0]
    ? assets[0] === "native"
      ? "XLM"
      : assets[0]
    : "";
  const secondaryAsset = assets[1].split(":")[0];
  return mainAsset + "/" + secondaryAsset;
};

const calculatePrice = (reserves: Reserve[]) => {
  const [mainReserve, secondaryReserve] = reserves;
  const amountsAreValid =
    !isNaN(parseFloat(mainReserve.amount)) &&
    !isNaN(parseFloat(secondaryReserve.amount));
  const secondaryReserveIsNotZero = parseFloat(secondaryReserve.amount) !== 0;

  if (amountsAreValid && secondaryReserveIsNotZero) {
    const price =
      parseFloat(mainReserve.amount) / parseFloat(secondaryReserve.amount);
    return price.toFixed(2);
  } else return 0;
};

const generateStellarXUrl = (reserves: Reserve[]) => {
  const [mainReserve, secondaryReserve] = reserves;
  return `https://stellarx.com/markets/${mainReserve.asset}/${secondaryReserve.asset}`;
};

export { getAssetPair, calculatePrice, generateStellarXUrl };
