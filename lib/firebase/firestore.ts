import {
  collection,
  onSnapshot,
  query,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  orderBy,
  Timestamp,
  runTransaction,
  where,
  addDoc,
  getFirestore,
} from "firebase/firestore";

import { db } from "@/lib/firebase/clientApp";
import { UserRole } from "../enums";

export const addUserToFirestore = async (
  userId: string,
  name: string,
  email: string,
  role: UserRole = UserRole.NON_VERIFIED
) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      name,
      email,
      role,
      createdAt: Timestamp.now(),
    });
    console.log("User added to Firestore");
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
};
