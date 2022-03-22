import React from "react";
import { useSdk } from "./useSdk";
import { useEthers } from "@usedapp/core";
import { BlitmapContractContext } from "../contexts/BlitmapContractContext";

export const useBlitmapContract = () => {
  const { account } = useEthers();
  const sdk = useSdk();

  const { creatorsAddresses, setCreatorsAddresses } = React.useContext(
    BlitmapContractContext
  );

  React.useEffect(() => {
    if (creatorsAddresses === null && sdk && account) {
      const promises: Promise<string>[] = [];
      for (let i = 0; i < 100; i++) {
        promises.push(sdk.Blitmap.tokenCreatorOf(i));
      }

      Promise.all(promises).then((creators) => {
        const result: Record<string, number[]> = {};
        creators.forEach((address, index) => {
          if (!result[address]) {
            result[address] = [];
          }

          result[address].push(index);
        });

        setCreatorsAddresses(result);
      });
    }
  }, [sdk, account, creatorsAddresses, setCreatorsAddresses]);

  const currentUserCreatedTokenIds = React.useMemo(() => {
    if (!account || creatorsAddresses === null || !creatorsAddresses[account]) {
      return [];
    }

    return creatorsAddresses[account];
  }, [account, creatorsAddresses]);

  return {
    creatorsAddresses,
    currentUserCreatedTokenIds,
  };
};
