import type { firestore } from "firebase-admin";
import { db } from "./serverApp";
import * as firebase from 'firebase/app';
import 'firebase/firestore';

export async function serverSidePaginateCollection<T>(
  path: string,
  builder: (data: Record<string, any>, documentID: string) => T,
  pageSize = 10,
  lastDocumentId?: string,
  sortField?: string,
  sortDirection: 'asc' | 'desc' = 'asc',
  filterField?: string,
  filterValue?: string
): Promise<{
  data: T[];
  lastDocumentId: string | undefined;
  hasMore: boolean;
  totalCount: number;
}> {
  try {
    console.log("Entering serverSidePaginateCollection function");
    console.log("Path:", path);
    console.log("PageSize:", pageSize);
    console.log("Sort Field:", sortField);
    console.log("Sort Direction:", sortDirection);
    console.log("Filter Field:", filterField);
    console.log("Filter Value:", filterValue);

    let query: firestore.Query = db.collection(path);

    // Apply filtering
    if (filterField && filterValue) {
      query = query.where(filterField, '==', filterValue);
    }

    // Apply sorting
    if (sortField) {
      query = query.orderBy(sortField, sortDirection);
    }

    // Get total count (before pagination)
    const countSnapshot = await query.count().get();
    const totalCount = countSnapshot.data().count;

    // Apply pagination
    if (lastDocumentId) {
      const lastDocSnapshot = await db.collection(path).doc(lastDocumentId).get();
      if (lastDocSnapshot.exists) {
        query = query.startAfter(lastDocSnapshot);
      }
    }

    query = query.limit(pageSize + 1);

    const querySnapshot = await query.get();
    console.log("Number of documents fetched:", querySnapshot.size);

    const docs = querySnapshot.docs;
    const hasMore = docs.length > pageSize;
    const data = docs
      .slice(0, pageSize)
      .map((doc: { data: () => Record<string, any>; id: string; }) => builder(doc.data(), doc.id));

    const lastDoc = docs[pageSize - 1];
    const newLastDocumentId = lastDoc ? lastDoc.id : undefined;

    console.log("Has more documents:", hasMore);
    console.log("Last document ID:", newLastDocumentId);
    console.log("Total count:", totalCount);

    return {
      data,
      lastDocumentId: newLastDocumentId,
      hasMore,
      totalCount,
    };
  } catch (error) {
    console.error("Error in serverSidePaginateCollection:", error);
    throw error;
  }
}