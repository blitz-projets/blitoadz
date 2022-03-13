import React from "react";
import { useSdk } from "./useSdk";
import { useEthers } from "@usedapp/core";
import { SnackbarErrorContext } from "../contexts/SnackbarErrorContext";
import { ethers } from "ethers";

export const useBlitoadzContract = () => {
  const { account } = useEthers();
  const sdk = useSdk();

  const [isMinting, setIsMinting] = React.useState<boolean>(false);
  const [price, setPrice] = React.useState<number | null>(null);
  const { setError } = React.useContext(SnackbarErrorContext);

  React.useEffect(() => {
    if (sdk && !price) {
      sdk.Blitoadz.MINT_PUBLIC_PRICE().then((price) => {
        setPrice(price.toNumber());
      });
    }
  }, [sdk, price]);

  const mint = React.useCallback(
    (toadzId: number, blitmapId: number): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        if (sdk && account && price) {
          try {
            setIsMinting(true);
            await sdk.Blitoadz.mintPublicSale([toadzId], [blitmapId], {
              from: account,
              value: ethers.utils.parseEther(price.toString()),
            });
            setIsMinting(false);
          } catch (e: unknown) {
            setIsMinting(false);
            setError((e as { error: Error }).error.message);
            reject(e);
          }
        } else {
          resolve();
        }
      });
    },
    []
  );

  const blitoadzExists = React.useCallback(
    (toadzId: number, blitmapId: number): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
        if (sdk) {
          try {
            const exists = await sdk.Blitoadz.blitoadzExist(
              toadzId * 100 + blitmapId
            );
            resolve(exists);
          } catch (e: unknown) {
            setError((e as { error: Error }).error.message);
            reject(e);
          }
        } else {
          resolve(false);
        }
      });
    },
    []
  );

  return {
    address: sdk?.Blitoadz.address,
    mint,
    isMinting,
    blitoadzExists,
  };
};
