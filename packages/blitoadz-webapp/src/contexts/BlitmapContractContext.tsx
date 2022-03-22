import React, { PropsWithChildren } from "react";

export const BlitmapContractContext = React.createContext<{
  creatorsAddresses: Record<string, number[]> | null;
  setCreatorsAddresses: (addresses: Record<string, number[]>) => void;
}>({
  creatorsAddresses: null,
  setCreatorsAddresses: () => {},
});

export const BlitmapContractContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [creatorsAddresses, setCreatorsAddresses] = React.useState<Record<
    string,
    number[]
  > | null>(null);

  return (
    <BlitmapContractContext.Provider
      value={{
        creatorsAddresses,
        setCreatorsAddresses,
      }}
    >
      {children}
    </BlitmapContractContext.Provider>
  );
};
