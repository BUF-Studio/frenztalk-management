import {
  doc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  deleteDoc,
  onSnapshot,
  type Query,
  type QuerySnapshot,
  type DocumentSnapshot,
  type DocumentData,
  type CollectionReference,
  Timestamp,
} from "firebase/firestore";

import { UserRole } from "../../enums";
import { db } from "./clientApp";

export const setData = async (
  path: string,
  data: Record<string, any>,
): Promise<void> => {
  try {
    const reference = doc(db, path);
    console.log(`${path}: ${JSON.stringify(data)}`);
    await setDoc(reference, data);
    console.log("Data successfully set");
  } catch (error) {
    console.error("Error setting document:", error);
  }
};

export const updateData = async (
  path: string,
  data: Record<string, any>,
): Promise<void> => {
  try {
    const reference = doc(db, path);
    console.log(`${path}: ${JSON.stringify(data)}`);
    await updateDoc(reference, data);
    console.log("Data successfully updated");
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

export const addData = async (
  path: string,
  data: Record<string, any>,
): Promise<string> => {
  try {
    const reference = collection(db, path);
    console.log(`${path}: ${JSON.stringify(data)}`);
    const docRef = await addDoc(reference, data);
    console.log("Data successfully added");
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

export const deleteData = async (path: string): Promise<void> => {
  try {
    const reference = doc(db, path);
    console.log(`delete: ${path}`);
    await deleteDoc(reference);
    console.log("Data successfully deleted");
  } catch (error) {
    console.error("Error deleting document:", error);
  }
};

export function documentStream<T>(
  path: string,
  builder: (data: Record<string, any>, documentID: string) => T,
): void {
  const reference = doc(db, path);
  const unsubscribe = onSnapshot(reference, (snapshot: DocumentSnapshot) => {
    const data = snapshot.data();
    if (data) {
      console.log(builder(data, snapshot.id));
    } else {
      console.log("No data found for document:", snapshot.id);
    }
  });
}

export function collectionStream<T>(
  path: string,
  builder: (data: Record<string, any>, documentID: string) => T,
  onUpdate: (updatedData: T[]) => void,
  queryBuilder?: (query: Query<DocumentData>) => Query<DocumentData>,
  sort?: (lhs: T, rhs: T) => number,
): () => void {
  let q: CollectionReference<DocumentData> | Query<DocumentData> = collection(
    db,
    path,
  );

  if (queryBuilder) {
    q = queryBuilder(q as Query<DocumentData>);
  }

  const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    let result = snapshot.docs.map((doc) => builder(doc.data(), doc.id));
    if (sort) {
      result = result.sort(sort);
    }
    console.log(result); // Example: Logging the sorted result
    // Optionally, you can handle state updates or other logic here
    if (onUpdate) {
      onUpdate(result);
    }
  });

  return unsubscribe;
}

export const addUserToFirestore = async (
  userId: string,
  name: string,
  email: string,
  role: UserRole = UserRole.NON_VERIFIED,
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
