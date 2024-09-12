import { usersStream } from "@/lib/firebase/user";
import { User, UserRole } from "@/lib/models/user";
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
  verifiedUsers: User[];
  unverifiedUsers: User[];
};

const initialContext: UsersContextType = {
  verifiedUsers: [],
  unverifiedUsers: [],
};
// Create a context to hold the data
const UsersContext = createContext<UsersContextType>(initialContext);

type UsersProviderProps = {
  children: ReactNode;
};

export const useUsers = () => useContext(UsersContext);

function UsersProvider({ children }: UsersProviderProps) {
  const [verifiedUsers, setVerifiedUsers] = useState<User[]>([]);
  const [unverifiedUsers, setUnverifiedUsers] = useState<User[]>([]);

  // Fetch data from Firebase and set up listeners
  useEffect(() => {
    const onUpdate = (users: User[]) => {
      const verifiedUser = users.filter(user =>
        user.role === UserRole.ADMIN || user.role === UserRole.TUTOR
      )
      const unverifiedUser = users.filter(user =>
        user.role === UserRole.NON_VERIFIED
      )
     
      setVerifiedUsers(verifiedUser);
      setUnverifiedUsers(unverifiedUser);
    };

    const unsubscribe = usersStream(onUpdate);

    return () => unsubscribe();
  }, []);

  return (
    <UsersContext.Provider value={{ verifiedUsers, unverifiedUsers }}>
      {children}
    </UsersContext.Provider>
  );
}

export default UsersProvider;
