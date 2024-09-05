import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  getDoc,
  onSnapshot,
  type Query,
  type QuerySnapshot,
  type DocumentSnapshot,
  Firestore,
  type DocumentData,
  type CollectionReference,
  query,
  orderBy,
  limit,
  startAfter,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { db } from "./clientApp";

export async function paginateCollection<T>(
  path: string,
  builder: (data: Record<string, any>, documentID: string) => T,
  pageSize = 10
): Promise<T[]> {
  try {
    console.log("Entering paginateCollection function");
    console.log("Path:", path);
    console.log("PageSize:", pageSize);
    console.log("DB object:", db);

    const collectionRef = collection(db, path);
    console.log("Collection reference:", collectionRef);

    const q = query(
      collectionRef,
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );
    console.log("Query object:", q);

    const querySnapshot = await getDocs(q);
    console.log("Query snapshot:", querySnapshot);

    const docs = querySnapshot.docs;
    console.log("Number of documents:", docs.length);

    const result = docs.map((doc) => builder(doc.data(), doc.id));
    console.log("Mapped results:", result);

    return result;
  } catch (error) {
    console.error("Detailed error in paginateCollection:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
}

export const setData = async (
  path: string,
  data: Record<string, any>
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
  data: Record<string, any>
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
  data: Record<string, any>
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
  onUpdate: (updatedData: T) => void
): () => void {
  const reference = doc(db, path);
  let previousData: T | undefined;

  const unsubscribe = onSnapshot(reference, (snapshot: DocumentSnapshot) => {
    const data = builder(snapshot.data()!, snapshot.id);
    console.log(builder(snapshot.data()!, snapshot.id));

    if (onUpdate) {
      onUpdate(data);
    }
  });
  return unsubscribe;
}

export function collectionStream<T>(
  path: string,
  builder: (data: Record<string, any>, documentID: string) => T,
  onUpdate: (updatedData: T[]) => void,
  queryBuilder?: (query: Query<DocumentData>) => Query<DocumentData>,
  sort?: (lhs: T, rhs: T) => number
): () => void {
  let q: CollectionReference<DocumentData> | Query<DocumentData> = collection(
    db,
    path
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
