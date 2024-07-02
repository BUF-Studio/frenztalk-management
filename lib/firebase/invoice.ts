import { Invoice } from "../models/invoice";
import { addData, collectionStream, documentStream, setData, } from "./service/firestoreService";

const PATH = "invoices";

export const addInvoice = async (
  invoice: Invoice
): Promise<void> => {
  try {
    const path = PATH
    const data = invoice.toMap();
    await addData(path, data);
    console.log("Invoice added to Firestore");
  } catch (error) {
    console.error("Error adding invoice to Firestore:", error);
  }
};

export const setInvoice = async (
  // invoiceId: string,
  invoice: Invoice
): Promise<void> => {
  try {
    const path = `${PATH}/${invoice.invoiceId}`;
    const data = invoice.toMap();
    await setData(path, data);
    console.log(`Invoice ${invoice.invoiceId} updated in Firestore`);
  } catch (error) {
    console.error(`Error setting invoice ${invoice.invoiceId} in Firestore:`, error);
  }
};

export const invoicesStream = (onUpdate: (updatedData: Invoice[]) => void,) => {
  const builder = (data: Record<string, any>, id: string) => Invoice.fromMap(data, id);


  // Subscribe to the collection stream
  const unsubscribe = collectionStream(
    PATH, // Firestore collection path
    builder,
    onUpdate,
  );
  // Cleanup function
  return () => unsubscribe();
}