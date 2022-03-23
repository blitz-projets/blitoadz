import React, { PropsWithChildren } from "react";

export const BlitoadzContractContext = React.createContext<{
  userBlitoadzIds: number[];
  setUserBlitoadzIds: (ids: number[]) => void;
  totalSupply: number | null;
  setTotalSupply: (value: number) => void;
  alreadyMintedCount: number | null;
  setAlreadyMintedCount: (value: number) => void;
  userShares: number | null;
  setUserShares: (value: number) => void;
  userRemainingAllocation: number | null;
  setUserRemainingAllocation: (value: number) => void;
}>({
  userBlitoadzIds: [],
  setUserBlitoadzIds: () => {},
  totalSupply: null,
  setTotalSupply: () => {},
  alreadyMintedCount: null,
  setAlreadyMintedCount: () => {},
  userShares: null,
  setUserShares: () => {},
  userRemainingAllocation: null,
  setUserRemainingAllocation: () => {},
});

export const BlitoadzContractContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [userBlitoadzIds, setUserBlitoadzIds] = React.useState<number[]>([]);
  const [totalSupply, setTotalSupply] = React.useState<number | null>(null);
  const [alreadyMintedCount, setAlreadyMintedCount] = React.useState<
    number | null
  >(null);
  const [userShares, setUserShares] = React.useState<number | null>(null);
  const [userRemainingAllocation, setUserRemainingAllocation] = React.useState<
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
        userShares,
        setUserShares,
        userRemainingAllocation,
        setUserRemainingAllocation,
      }}
    >
      {children}
    </BlitoadzContractContext.Provider>
  );
};
