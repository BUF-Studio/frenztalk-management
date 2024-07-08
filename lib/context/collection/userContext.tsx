import { userStream } from "@/lib/firebase/user";
import { User } from "@/lib/models/user";
import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  user: User | null | undefined;
};

const initialContext: UserContextType = {
  user: null,
};
// Create a context to hold the data
const UserContext = createContext<UserContextType>(initialContext);

type UserProviderProps = {
  children: ReactNode;
  userId: string;
};


export const useUser = () => useContext(UserContext);

function UserProvider({ children, userId }: UserProviderProps) {
  const [user, setUser] = useState<User>();

  // Fetch data from Firebase and set up listeners
  useEffect(() => {
    const onUpdate = (userData: User) => {
      setUser(userData);
    };

    const unsubscribe = userStream(onUpdate, userId);

    return () => {
      unsubscribe();
    };
  }, [userId]);


  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;