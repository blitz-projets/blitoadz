import React from "react";
import { useSdk } from "./useSdk";
import { useEthers } from "@usedapp/core";
import { SnackbarErrorContext } from "../contexts/SnackbarErrorContext";
import { ethers } from "ethers";

export const useBlitoadzContract = () => {
  const { account } = useEthers();
  const sdk = useSdk();

  const [isMinting, setIsMinting] = React.useState<boolean>(false);
  const [minted, setMinted] = React.useState<number[]>([]);
  const [price, setPrice] = React.useState<ethers.BigNumber | null>(null);
  const { setError } = React.useContext(SnackbarErrorContext);

  React.useEffect(() => {
    if (sdk && !price) {
      sdk.Blitoadz.MINT_PUBLIC_PRICE().then(setPrice);
    }
  }, [sdk, price]);

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
    [sdk]
  );

  const waitForBlitoadzMint = React.useCallback(
    (toadzId: number, blitmapId: number): Promise<void> => {
      if (sdk && account) {
        return new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const exists = await blitoadzExists(toadzId, blitmapId);

              if (exists) {
                resolve();
              } else {
                await waitForBlitoadzMint(toadzId, blitmapId);
                resolve();
              }
            } catch {
              await waitForBlitoadzMint(toadzId, blitmapId);
              resolve();
            }
          }, 5000);
        });
      } else {
        return Promise.resolve();
      }
    },
    [sdk, account, blitoadzExists]
  );

  const mint = React.useCallback(
    (toadzId: number, blitmapId: number): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        if (sdk && account && price) {
          try {
            setIsMinting(true);
            await sdk.Blitoadz.mintPublicSale([toadzId], [blitmapId], {
              from: account,
              value: price,
            });
            await waitForBlitoadzMint(toadzId, blitmapId);
            setMinted([...minted, toadzId * 100 + blitmapId]);
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
    [sdk, account, price, waitForBlitoadzMint, minted]
  );

  const hasBeenMinted = React.useCallback(
    (toadzId: number, blitmapId: number): boolean =>
      !!minted.find((id) => id === toadzId * 100 + blitmapId),
    [minted]
  );

  return {
    address: sdk?.Blitoadz.address,
    mint,
    isMinting,
    blitoadzExists,
    hasBeenMinted,
  };
};
