import { type DocumentData, type Query, query, where } from "firebase/firestore";
import { addData, collectionStream, setData } from "./service/firestoreService";
import { ZoomAccount } from "../models/zoom";

const PATH = "zoomAccount";

export const addZoomAccount = async (
  zoomAccount: ZoomAccount,
): Promise<string> => {
  try {
    const path = PATH;
    const data = zoomAccount.toMap();
    const id = await addData(path, data);
    console.log("Zoom Account added to Firestore");
    return id;
  } catch (error) {
    console.error("Error adding Zoom Account to Firestore:", error);
    throw error;
  }
};

export const updateZoomAccount = async (
  zoomAccount: ZoomAccount,
): Promise<void> => {
  try {
    const path = `${PATH}/${zoomAccount.id}`;
    const data = zoomAccount.toMap();
    await setData(path, data);
    console.log(`Zoom Account ${zoomAccount.id} updated in Firestore`);
  } catch (error) {
    console.error(
      `Error setting Zoom Account ${zoomAccount.id} in Firestore:`,
      error,
    );
  }
};

export const zoomAccountStream = (
  onUpdate: (updatedData: ZoomAccount[]) => void,
) => {
  const builder = (data: Record<string, any>, id: string) =>
    ZoomAccount.fromMap(data, id);

  let queryBuilder:
    | ((query: Query<DocumentData>) => Query<DocumentData>)
    | undefined;

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
