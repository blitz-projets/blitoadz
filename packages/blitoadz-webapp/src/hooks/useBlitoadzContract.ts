import React from "react";
import { useSdk } from "./useSdk";
import { useEthers } from "@usedapp/core";
import { SnackbarErrorContext } from "../contexts/SnackbarErrorContext";
import { BlitoadzContractContext } from "../contexts/BlitoadzContractContext";

export const useBlitoadzContract = () => {
  const { account } = useEthers();
  const sdk = useSdk();

  const [isMinting, setIsMinting] = React.useState<boolean>(false);
  const [minted, setMinted] = React.useState<number[]>([]);
  const {
    userBlitoadzIds,
    setUserBlitoadzIds,
    setAlreadyMintedCount,
    alreadyMintedCount,
    totalSupply,
    setTotalSupply,
    userShares,
    setUserShares,
  } = React.useContext(BlitoadzContractContext);
  const { setError } = React.useContext(SnackbarErrorContext);

  const fetchUserData = React.useCallback(() => {
    if (sdk && account) {
      return sdk.Blitoadz.founders(account).then((data) => {
        setUserShares(data.shares);
        return data;
      });
    }

    return { shares: null, remainingAllocation: null, withdrawnAmount: null };
  }, [sdk, account, setUserShares]);

  React.useEffect(() => {
    if (userShares === null && sdk && account) {
      fetchUserData();
    }
  }, [sdk, account, fetchUserData, userShares]);

  React.useEffect(() => {
    if (totalSupply === null && sdk) {
      sdk.Blitoadz.BLITOADZ_COUNT().then(setTotalSupply);
    }
  }, [sdk, setTotalSupply, totalSupply]);

  const fetchAlreadyMintedCount = React.useCallback(async () => {
    if (sdk) {
      const value = await sdk.Blitoadz.totalSupply();
      setAlreadyMintedCount(value.toNumber());

      return value.toNumber();
    }
  }, [sdk, setAlreadyMintedCount]);

  React.useEffect(() => {
    if (alreadyMintedCount === null && sdk) {
      fetchAlreadyMintedCount();
    }
  }, [alreadyMintedCount, fetchAlreadyMintedCount, sdk]);

  const fetchUserBlitoadz = React.useCallback(async () => {
    if (sdk && account) {
      try {
        const balance = await sdk.Blitoadz.balanceOf(account);
        const count = balance.toNumber();

        const promises = [];
        for (let i = 0; i < count; i++) {
          promises.push(
            sdk.Blitoadz.tokenOfOwnerByIndex(account, i)
              .then((bigId) => bigId.toNumber())
              .catch(() => null)
          );
        }

        const ids = (await Promise.all(promises)).filter(
          (id) => id !== null
        ) as number[];

        setUserBlitoadzIds(ids);

        return ids;
      } catch (e: unknown) {
        setError((e as { error: Error }).error.message);
      }
    }
  }, [sdk, account, setUserBlitoadzIds, setError]);

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
    [sdk, setError]
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
    (
      toadzId: number,
      blitmapId: number,
      paletteOrder: number
    ): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        if (sdk && account) {
          try {
            const { remainingAllocation } = await fetchUserData();
            const price = await sdk.Blitoadz.MINT_PUBLIC_PRICE();
            setIsMinting(true);

            if (remainingAllocation && remainingAllocation > 0) {
              await sdk.Blitoadz.mintAllocation(
                [toadzId],
                [blitmapId],
                [paletteOrder],
                {
                  from: account,
                }
              );
            } else {
              await sdk.Blitoadz.mintPublicSale(
                [toadzId],
                [blitmapId],
                [paletteOrder],
                {
                  from: account,
                  value: price,
                }
              );
            }
            await waitForBlitoadzMint(toadzId, blitmapId);
            setMinted([...minted, toadzId * 100 + blitmapId]);
            await fetchUserBlitoadz();
            await fetchAlreadyMintedCount();
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
    [
      sdk,
      account,
      waitForBlitoadzMint,
      minted,
      setError,
      fetchUserBlitoadz,
      fetchAlreadyMintedCount,
      fetchUserData,
    ]
  );

  const hasBeenMinted = React.useCallback(
    (toadzId: number, blitmapId: number): boolean =>
      !!minted.find((id) => id === toadzId * 100 + blitmapId),
    [minted]
  );

  const getSvg = React.useCallback(
    async (id: number) => {
      if (sdk) {
        const data = JSON.parse(
          (await sdk.Blitoadz["tokenURI(uint256)"](id)).replace(
            "data:application/json,",
            ""
          )
        );
        return data.image_data;
      } else {
        return null;
      }
    },
    [sdk]
  );

  const getSvgByToadzIdBlitmapId = React.useCallback(
    async (toadzId: number, blitmapId: number) => {
      if (sdk) {
        const data = JSON.parse(
          (
            await sdk.Blitoadz["tokenURI(uint8,uint8)"](toadzId, blitmapId)
          ).replace("data:application/json,", "")
        );

        return data.image_data.replace("data:image/svg+xml,", "");
      } else {
        return null;
      }
    },
    [sdk]
  );

  const generateRandomPaletteOrder = React.useCallback(() => {
    const colorArray = ["00", "01", "10", "11"];
    const shuffledArray = colorArray.sort((a, b) => 0.5 - Math.random());

    return parseInt(shuffledArray.join(""), 2);
  }, []);

  const isFounder = React.useMemo(() => {
    if (userShares === null) return false;

    return userShares > 0;
  }, [userShares]);

  const withdrawFounder = React.useCallback(async () => {
    if (sdk && account) {
      try {
        await sdk.Blitoadz.withdrawFounder();
      } catch (e: unknown) {
        setError((e as { error: Error }).error.message);
      }
    }
  }, [sdk, account, setError]);

  const withdrawBlitmapCreator = React.useCallback(async () => {
    if (sdk && account) {
      try {
        await sdk.Blitoadz.withdrawBlitmapCreator();
      } catch (e: unknown) {
        setError((e as { error: Error }).error.message);
      }
    }
  }, [sdk, account, setError]);

  return {
    address: sdk?.Blitoadz.address,
    mint,
    isMinting,
    blitoadzExists,
    hasBeenMinted,
    userBlitoadzIds,
    fetchUserBlitoadz,
    getSvg,
    getSvgByToadzIdBlitmapId,
    generateRandomPaletteOrder,
    totalSupply,
    alreadyMintedCount,
    isFounder,
    userShares,
    withdrawFounder,
    withdrawBlitmapCreator,
  };
};
