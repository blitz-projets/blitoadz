import React, { PropsWithChildren } from "react";

export const UserBlitoadzContext = React.createContext<{
  userBlitoadzIds: number[];
  setUserBlitoadzIds: (ids: number[]) => void;
}>({
  userBlitoadzIds: [],
  setUserBlitoadzIds: () => {},
});

export const UserBlitoadzContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [userBlitoadzIds, setUserBlitoadzIds] = React.useState<number[]>([]);

  return (
    <UserBlitoadzContext.Provider
      value={{
        userBlitoadzIds,
        setUserBlitoadzIds,
      }}
    >
      {children}
    </UserBlitoadzContext.Provider>
  );
};
