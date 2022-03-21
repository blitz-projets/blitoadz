import React from "react";
import { useEthers } from "@usedapp/core";
import { getMainSdk } from "@dethcrypto/eth-sdk-client";
import { ethers } from "ethers";
import config from "../config";

export const useSdk = () => {
  const { library, account } = useEthers();

  const signer = React.useMemo(() => {
    if (!library) return null;

    if (!account) {
      const provider = new ethers.providers.JsonRpcProvider(
        config.app.jsonRpcUri
      );
      return ethers.Wallet.createRandom().connect(provider);
    }

    return library.getSigner();
  }, [account, library]);

  return React.useMemo(() => (signer ? getMainSdk(signer) : null), [signer]);
};
