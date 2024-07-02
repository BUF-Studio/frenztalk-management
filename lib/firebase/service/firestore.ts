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

import { UserRole } from "../../enums";
import { db } from "./clientApp";

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
