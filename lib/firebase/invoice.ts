import { DocumentData, Query, query, where } from "firebase/firestore";
import { Invoice } from "../models/invoice";
import { addData, collectionStream, setData } from "./service/firestoreService";

const PATH = "invoices";

export const addInvoice = async (invoice: Invoice): Promise<void> => {
  try {
    const path = PATH;
    const data = invoice.toMap();
    await addData(path, data);
    console.log("Invoice added to Firestore");
  } catch (error) {
    console.error("Error adding invoice to Firestore:", error);
  }
};

export const setInvoice = async (
  // id: string,
  invoice: Invoice,
): Promise<void> => {
  try {
    const path = `${PATH}/${invoice.id}`;
    const data = invoice.toMap();
    await setData(path, data);
    console.log(`Invoice ${invoice.id} updated in Firestore`);
  } catch (error) {
    console.error(
      `Error setting invoice ${invoice.id} in Firestore:`,
      error,
    );
  }
};

export const invoicesStream = (
  onUpdate: (updatedData: Invoice[]) => void,
  tutorId?: string,
) => {
  const builder = (data: Record<string, any>, id: string) =>
    Invoice.fromMap(data, id);
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
