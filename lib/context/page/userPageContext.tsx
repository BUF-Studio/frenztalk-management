import type { User } from "@/lib/models/user";
import { AppProps } from "next/app";
import type { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserPageContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const initialContext: UserPageContextType = {
  user: null,
  setUser: () => {},
};
// Create a context to hold the data
const UserPageContext = createContext<UserPageContextType>(initialContext);

export const useUserPage = () => useContext(UserPageContext);

function UserPageProvider({ children }: ScriptProps) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserPageContext.Provider value={{ user, setUser }}>
      {children}
    </UserPageContext.Provider>
  );
}

export default UserPageProvider;
