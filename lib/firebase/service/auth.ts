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

export function onAuthStateChanged(cb: (user: User | null) => void) {
  return _onAuthStateChanged(auth, cb);
}

async function createSession(user: User) {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/auth", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.status === 200;
}

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const resultUserCredential = await signInWithPopup(auth, provider);
    const uid = resultUserCredential.user.uid;

    addUserToFirestore(
      uid,
      resultUserCredential.user.displayName || "",
      resultUserCredential.user.email || ""
    );

    const sessionCreated = await createSession(resultUserCredential.user);
    if (sessionCreated) {
      console.log("Google Sign-in Successful");
    } else {
      console.error("Failed to create session after Google Sign-in");
    }
  } catch (error) {
    console.error("Error signing in with Google:", error);

    const auth = getAuth();
    if (auth.currentUser) {
      await deleteUserFromAuth(auth.currentUser);
    }
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const resultUserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const sessionCreated = await createSession(resultUserCredential.user);
    if (sessionCreated) {
      console.log("Login Successful");
    } else {
      console.error("Failed to create session after Email Sign-in");
    }

    return resultUserCredential.user;
  } catch (error) {
    console.error("Error logging in with email and password:", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const resultUserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = resultUserCredential.user.uid;

    addUserToFirestore(
      uid,
      resultUserCredential.user.displayName || "",
      resultUserCredential.user.email || ""
    );

    const sessionCreated = await createSession(resultUserCredential.user);
    if (sessionCreated) {
      console.log("Sign-up Successful");
    } else {
      console.error("Failed to create session after Sign-up");
    }

    return resultUserCredential.user;
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
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    await fetch("/api/auth", { method: "DELETE" });
    console.log("Signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};