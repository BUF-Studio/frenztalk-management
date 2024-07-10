import { type DocumentData, type Query, query, where } from "firebase/firestore";
import { addData, collectionStream, setData } from "./service/firestoreService";
import { AvaSubject } from "../models/avaSubject";

const PATH = "avaSubjects";

export const addAvaSubject = async (
  avaSubject: AvaSubject,
): Promise<string> => {
  try {
    const path = PATH;
    const data = avaSubject.toMap();
    const id = await addData(path, data);
    console.log("AvaSubject added to Firestore");
    return id;
  } catch (error) {
    console.error("Error adding avaSubject to Firestore:", error);

    throw error;
  }
};

export const updateAvaSubject = async (
  // id: string,
  avaSubject: AvaSubject,
): Promise<void> => {
  try {
    const path = `${PATH}/${avaSubject.id}`;
    const data = avaSubject.toMap();
    await setData(path, data);
    console.log(`AvaSubject ${avaSubject.id} updated in Firestore`);
  } catch (error) {
    console.error(
      `Error setting avaSubject ${avaSubject.id} in Firestore:`,
      error,
    );
  }
};

export const avaSubjectsStream = (
  onUpdate: (updatedData: AvaSubject[]) => void,
) => {
  const builder = (data: Record<string, any>, id: string) =>
    AvaSubject.fromMap(data, id);

  let queryBuilder:
    | ((query: Query<DocumentData>) => Query<DocumentData>)
    | undefined;

  // if (tutorId) {
  //   queryBuilder = (q: Query<DocumentData>) => query(q, where('tutorId', 'array-contains', tutorId));
  // }

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
