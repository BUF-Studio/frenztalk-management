import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  deleteUserFromAuth,
} from "@/lib/firebase/service/auth";
import { auth, db } from "@/lib/firebase/service/clientApp";
import { doc, getDoc } from "firebase/firestore";
import type { UserRole } from "@/lib/enums";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (email: string, password: string) => Promise<User>;
  deleteUserFromAuth: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  const fetchUserRole = useCallback(
    async (userId: string): Promise<UserRole | null> => {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        console.error("No such document aaaa!");
        return null;
      }
      const userData = userDoc.data();
      console.log("userRole", userData.role);
      return userData.role as UserRole;
    },
    []
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRole = await fetchUserRole(currentUser.uid);
        setRole(userRole);
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, [fetchUserRole]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        deleteUserFromAuth,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
