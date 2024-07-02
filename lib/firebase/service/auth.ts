import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  deleteUser,
  onAuthStateChanged as _onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";

import { auth } from "./clientApp";

// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     const userDoc = await getDoc(doc(db, "users", user.uid));
//     const userData = userDoc.data();
//     const userRole = userData.role;
//     // Store the user role in state or context
//   }
// });
export function onAuthStateChanged(cb: (user: User | null) => void){
    return _onAuthStateChanged(auth, cb);
}

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google:", error);
  }
  return;
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  } catch (error) {
    console.error("Error logging in with email and password:", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.log("Error signing up with email and password:", error);
    throw error;
  }
};

export const deleteUserFromAuth = async(user : User) => {
  try {
    await deleteUser(user);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
  return;
}

export const signOut = async() => {
  try {
    await firebaseSignOut(auth);
    console.log("Signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
  }
  return;
}
