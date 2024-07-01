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

export const addStudentToFirestore = async (
  // studentId: string,
  name: string,
) => {
  try {
    const userRef = collection(db, "students");
    await addDoc(userRef, {
      name,
    });
    console.log("User added to Firestore");
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
};
