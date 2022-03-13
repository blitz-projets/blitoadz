import React from "react";
import { useSdk } from "./useSdk";
import { useEthers } from "@usedapp/core";
import { SnackbarErrorContext } from "../contexts/SnackbarErrorContext";
import { ethers } from "ethers";

export const useBlitoadzRendererContract = () => {
  const sdk = useSdk();

  const { setError } = React.useContext(SnackbarErrorContext);

  const getSvg = React.useCallback(
    (toadzId: number, blitmapId: number): Promise<string> => {
      return new Promise(async (resolve, reject) => {
        if (sdk) {
          try {
            const svg = await sdk.BlitoadzRenderer.getBlitoadz(
              blitmapId,
              toadzId
            );
            resolve(svg);
          } catch (e: unknown) {
            setError((e as { error: Error }).error.message);
            reject(e);
          }
        } else {
          reject();
        }
      });
    },
    []
  );

  return {
    address: sdk?.BlitoadzRenderer.address,
    getSvg,
  };
};
