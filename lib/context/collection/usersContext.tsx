import { usersStream } from "@/lib/firebase/user";
import { User } from "@/lib/models/user";
import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type UsersContextType = {
  users: User[];
};

const initialContext: UsersContextType = {
  users: [],
};
// Create a context to hold the data
const UsersContext = createContext<UsersContextType>(initialContext);

type UsersProviderProps = {
  children: ReactNode;
};

export const useUsers = () => useContext(UsersContext);

function UsersProvider({ children }: UsersProviderProps) {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch data from Firebase and set up listeners
  useEffect(() => {
    const onUpdate = (users: User[]) => {
      setUsers(users);
    };

    const unsubscribe = usersStream(onUpdate);

    return () => unsubscribe();
  }, []);

  return (
    <UsersContext.Provider value={{ users }}>
      {children}
    </UsersContext.Provider>
  );
}

export default UsersProvider;
