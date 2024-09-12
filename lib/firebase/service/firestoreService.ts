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
  type QueryConstraint,
  where,
  getCountFromServer,
} from "firebase/firestore";

import { db } from "./clientApp";

export interface PaginationOptions {
  pageSize?: number;
  lastDocumentId?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  filterField?: string;
  filterValue?: any;
}

export interface PaginationResult<T> {
  items: T[];
  lastDocumentId: string | undefined;
  hasMore: boolean;
  totalCount: number;
}

export async function paginateCollection<T>(
  path: string,
  builder: (data: Record<string, any>, documentID: string) => T,
  options: PaginationOptions = {}
): Promise<PaginationResult<T>> {
  try {
    console.log("Entering paginateCollection function");
    console.log("Path:", path);
    console.log("Options:", options);

    const {
      pageSize = 10,
      lastDocumentId,
      sortField = "",
      sortDirection = "asc",
      filterField,
      filterValue,
    } = options;

    const collectionRef = collection(db, path);
    console.log("Collection reference:", collectionRef);

    const queryConstraints: QueryConstraint[] = [];

    // Apply filtering
    if (filterField && filterValue !== undefined) {
      queryConstraints.push(where(filterField, "==", filterValue));
    }

    if (sortField) {
      // Apply sorting
      queryConstraints.push(orderBy(sortField, sortDirection));
    }

    // Get total count (before pagination)
    const countSnapshot = await getCountFromServer(
      query(collectionRef, ...queryConstraints)
    );
    const totalCount = countSnapshot.data().count;

    // Apply pagination
    if (lastDocumentId) {
      const lastDocRef = doc(db, path, lastDocumentId);
      const lastDocSnapshot = await getDoc(lastDocRef);
      if (lastDocSnapshot.exists()) {
        queryConstraints.push(startAfter(lastDocSnapshot));
      }
    }

    queryConstraints.push(limit(pageSize + 1));

    const q = query(collectionRef, ...queryConstraints);
    console.log("Query object:", q);

    const querySnapshot = await getDocs(q);
    console.log("Query snapshot:", querySnapshot);

    const docs = querySnapshot.docs;
    console.log("Number of documents:", docs.length);

    const hasMore = docs.length > pageSize;
    const items = docs
      .slice(0, pageSize)
      .map((doc) => builder(doc.data(), doc.id));
    const lastDoc = docs[pageSize - 1];
    const newLastDocumentId = lastDoc ? lastDoc.id : undefined;

    console.log("Mapped results:", items);
    console.log("Has more:", hasMore);
    console.log("Last document ID:", newLastDocumentId);
    console.log("Total count:", totalCount);

    return {
      items,
      lastDocumentId: newLastDocumentId,
      hasMore,
      totalCount,
    };
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
