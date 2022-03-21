import React, { PropsWithChildren } from "react";
import { BigNumber } from "ethers";

export const BlitoadzContractContext = React.createContext<{
  userBlitoadzIds: number[];
  setUserBlitoadzIds: (ids: number[]) => void;
  totalSupply: number | null;
  setTotalSupply: (value: number) => void;
  alreadyMintedCount: number | null;
  setAlreadyMintedCount: (value: number) => void;
}>({
  userBlitoadzIds: [],
  setUserBlitoadzIds: () => {},
  totalSupply: null,
  setTotalSupply: () => {},
  alreadyMintedCount: null,
  setAlreadyMintedCount: () => {},
});

export const BlitoadzContractContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [userBlitoadzIds, setUserBlitoadzIds] = React.useState<number[]>([]);
  const [totalSupply, setTotalSupply] = React.useState<number | null>(null);
  const [alreadyMintedCount, setAlreadyMintedCount] = React.useState<
    number | null
  >(null);

  return (
    <BlitoadzContractContext.Provider
      value={{
        userBlitoadzIds,
        setUserBlitoadzIds,
        totalSupply,
        setTotalSupply,
        alreadyMintedCount,
        setAlreadyMintedCount,
      }}
    >
      {children}
    </BlitoadzContractContext.Provider>
  );
};
