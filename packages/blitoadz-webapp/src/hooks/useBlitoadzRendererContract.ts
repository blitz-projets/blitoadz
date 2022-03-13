import React from "react";
import { useSdk } from "./useSdk";
import { SnackbarErrorContext } from "../contexts/SnackbarErrorContext";

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
    [sdk, setError]
  );

  return {
    address: sdk?.BlitoadzRenderer.address,
    getSvg,
  };
};
