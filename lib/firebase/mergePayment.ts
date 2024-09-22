import { DocumentData, Query, query, where } from "firebase/firestore";
import { addData, collectionStream, setData } from "./service/firestoreService";
import { MergePayment } from "../models/mergePayment";

const PATH = "mergePayments";

export const addMergePayment = async (mergePayment: MergePayment): Promise<string | null> => {
  try {
    const path = PATH;
    const data = mergePayment.toMap();
    const id = await addData(path, data);
    console.log("MergePayment added to Firestore");
    return id
  } catch (error) {
    console.error("Error adding mergePayment to Firestore:", error);
    return null
  }
};

export const updateMergePayment = async (
  // id: string,
  mergePayment: MergePayment,
): Promise<void> => {
  try {
    const path = `${PATH}/${mergePayment.id}`;
    const data = mergePayment.toMap();
    await setData(path, data);
    console.log(`MergePayment ${mergePayment.id} updated in Firestore`);
  } catch (error) {
    console.error(
      `Error setting mergePayment ${mergePayment.id} in Firestore:`,
      error,
    );
  }
};

export const mergePaymentsStream = (
  onUpdate: (updatedData: MergePayment[]) => void,
  tutorId?: string |null,
) => {
  const builder = (data: Record<string, any>, id: string) =>
    MergePayment.fromMap(data, id);
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
