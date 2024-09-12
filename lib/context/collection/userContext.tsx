// import { userStream } from "@/lib/firebase/user";
// import type { User } from "@/lib/models/user";
// import { AppProps } from "next/app";
// import { ScriptProps } from "next/script";
// import React, {
//   type ReactNode,
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// type UserContextType = {
//   user: User | null | undefined;
//   // setUser: (user: User | null) => void;
// };

// const initialContext: UserContextType = {
//   user: null,
//   // setUser: () => {},
// };
// // Create a context to hold the data
// const UserContext = createContext<UserContextType>(initialContext);

// type UserProviderProps = {
//   children: ReactNode;
//   userId: string;
// };

// export const useUser = () => useContext(UserContext);

// function UserProvider({ children, userId }: UserProviderProps) {
//   const [user, setUser] = useState<User | null>();

//   // Fetch data from Firebase and set up listeners
//   useEffect(() => {
//     const onUpdate = (userData: User) => {
//       setUser(userData);
//     };

//     const unsubscribe = userStream(onUpdate, userId);

//     return () => {
//       unsubscribe();
//     };
//   }, [userId]);

//   return (
//     <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
//   );
// }

// export default UserProvider;
