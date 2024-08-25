"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  deleteUser,
  onAuthStateChanged as _onAuthStateChanged,
  getAuth,
} from "firebase/auth";
import type { User } from "firebase/auth";

import { auth } from "./clientApp";
import { addUserToFirestore } from "./firestore";
// import { auth as adminAuth } from "./serverApp";

export function onAuthStateChanged(cb: (user: User | null) => void) {
  return _onAuthStateChanged(auth, cb);
}

// export const verifyIdToken = async (idToken: string) => {
//   try {
//     const decodedToken = await adminAuth.verifyIdToken(idToken);
//     return decodedToken;
//   } catch (error) {
//     console.error("Error verifying ID token:", error);
//     throw error;
//   }
// }

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const resultUserCrendential = await signInWithPopup(auth, provider);
    const uid = resultUserCrendential.user.uid;

    addUserToFirestore(
      uid,
      resultUserCrendential.user.displayName || "",
      resultUserCrendential.user.email || ""
    );
  } catch (error) {
    console.error("Error signing in with Google:", error);

    const auth = getAuth();
    if (auth.currentUser) {
      await deleteUserFromAuth(auth?.currentUser);
    }
  }
  return;
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const resultUserCrendential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    fetch("/api/auth", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await resultUserCrendential.user.getIdToken()}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        console.log("Login Successfully")
      }
    });

    return resultUserCrendential.user;
  } catch (error) {
    console.error("Error logging in with email and password:", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const resultUserCrendential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = resultUserCrendential.user.uid;

    addUserToFirestore(
      uid,
      resultUserCrendential.user.displayName || "",
      resultUserCrendential.user.email || ""
    );

    return resultUserCrendential.user;
  } catch (error) {
    console.log("Error signing up with email and password:", error);
    throw error;
  }
};

export const deleteUserFromAuth = async (user: User) => {
  try {
    await deleteUser(user);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
  return;
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log("Signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
  }
  return;
};
