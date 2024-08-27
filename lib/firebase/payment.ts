import { DocumentData, Query, query, where } from "firebase/firestore";
import { addData, collectionStream, setData } from "./service/firestoreService";
import { Payment } from "../models/payment";

const PATH = "payments";

export const addPayment = async (payment: Payment): Promise<string | null> => {
  try {
    const path = PATH;
    const data = payment.toMap();
    const id = await addData(path, data);
    console.log("Payment added to Firestore");
    return id
  } catch (error) {
    console.error("Error adding payment to Firestore:", error);
    return null
  }
};

export const updatePayment = async (
  // id: string,
  payment: Payment,
): Promise<void> => {
  try {
    const path = `${PATH}/${payment.id}`;
    const data = payment.toMap();
    await setData(path, data);
    console.log(`Payment ${payment.id} updated in Firestore`);
  } catch (error) {
    console.error(
      `Error setting payment ${payment.id} in Firestore:`,
      error,
    );
  }
};

export const paymentsStream = (
  onUpdate: (updatedData: Payment[]) => void,
  tutorId?: string,
) => {
  const builder = (data: Record<string, any>, id: string) =>
    Payment.fromMap(data, id);
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
