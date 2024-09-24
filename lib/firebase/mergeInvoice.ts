import { DocumentData, Query, query, where } from "firebase/firestore";
import { MergeInvoice } from "../models/mergeInvoice";
import { addData, collectionStream, deleteData, setData } from "./service/firestoreService";

const PATH = "mergeInvoices";

export const addMergeInvoice = async (mergeInvoice: MergeInvoice): Promise<string | null> => {
  try {
    const path = PATH;
    const data = mergeInvoice.toMap();
    const id = await addData(path, data);
    console.log("MergeInvoice added to Firestore");
    return id
  } catch (error) {
    console.error("Error adding mergeInvoice to Firestore:", error);
    return null
  }
};

export const updateMergeInvoice = async (
  // id: string,
  mergeInvoice: MergeInvoice,
): Promise<void> => {
  try {
    const path = `${PATH}/${mergeInvoice.id}`;
    const data = mergeInvoice.toMap();
    await setData(path, data);
    console.log(`MergeInvoice ${mergeInvoice.id} updated in Firestore`);
  } catch (error) {
    console.error(
      `Error setting mergeInvoice ${mergeInvoice.id} in Firestore:`,
      error,
    );
  }
};
export const deleteMergeInvoice = async (
  id: string,
  // mergeInvoice: MergeInvoice,
): Promise<void> => {
  try {
    const path = `${PATH}/${id}`;
    await deleteData(path)
    console.log(`MergeInvoice ${id} deleted in Firestore`);
  } catch (error) {
    console.error(
      `Error setting mergeInvoice ${id} in Firestore:`,
      error,
    );
  }
};

export const mergeInvoicesStream = (
  onUpdate: (updatedData: MergeInvoice[]) => void,
  tutorId?: string,
) => {
  const builder = (data: Record<string, any>, id: string) =>
    MergeInvoice.fromMap(data, id);
  let queryBuilder:
    | ((query: Query<DocumentData>) => Query<DocumentData>)
    | undefined;

  if (tutorId) {
    queryBuilder = (q: Query<DocumentData>) =>
      query(q, where("tutorId", "==", tutorId));
  }

  // Subscribe to the collection stream
  const unsubscribe = collectionStream(
    PATH, // Firestore collection path
    builder,
    onUpdate,
    queryBuilder,
  );
  // Cleanup function
  return () => unsubscribe();
};
