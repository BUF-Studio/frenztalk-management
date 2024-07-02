import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, deleteUserFromAuth } from '@/lib/firebase/auth';
import { auth, db } from '@/lib/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { UserRole } from '@/lib/enums';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (email: string, password: string) => Promise<User>;
  deleteUserFromAuth: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.role as UserRole;
      } else {
        console.error('No such document!');
        return null;
      }
    
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRole = await fetchUserRole(currentUser.uid);
        setRole(userRole);
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, signInWithEmail, signUpWithEmail, signInWithGoogle, deleteUserFromAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};
