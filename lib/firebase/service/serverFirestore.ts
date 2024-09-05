import { db } from "./serverApp";

export async function serverSidePaginateCollection<T>(
  path: string,
  builder: (data: Record<string, any>, documentID: string) => T,
  pageSize = 10,
  lastDocumentId?: string
): Promise<{
  data: T[];
  lastDocumentId: string | undefined;
  hasMore: boolean;
}> {
  try {
    console.log("Entering serverSidePaginateCollection function");
    console.log("Path:", path);
    console.log("PageSize:", pageSize);

    const query = db.collection(path).limit(pageSize + 1);

    const querySnapshot = await query.get();
    console.log("Number of documents fetched:", querySnapshot.size);

    const docs = querySnapshot.docs;
    const hasMore = docs.length > pageSize;
    const data = docs
      .slice(0, pageSize)
      .map((doc) => builder(doc.data(), doc.id));

    const lastDoc = docs[pageSize - 1];
    const lastDocumentId = lastDoc ? lastDoc.id : undefined;

    console.log("Has more documents:", hasMore);
    console.log("Last document ID:", lastDocumentId);

    return {
      data,
      lastDocumentId,
      hasMore,
    };
  } catch (error) {
    console.error("Error in serverSidePaginateCollection:", error);
    throw error;
  }
}