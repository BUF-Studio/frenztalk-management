import { DocumentData, Query, query, where } from "firebase/firestore";
import { addData, collectionStream, setData, } from "./service/firestoreService";
import { AvaSubject } from "../models/avaSubject";

const PATH = "avaSubjects";

export const addAvaSubject = async (
  avaSubject: AvaSubject
): Promise<void> => {
  try {
    const path = PATH
    const data = avaSubject.toMap();
    await addData(path, data);
    console.log("AvaSubject added to Firestore");
  } catch (error) {
    console.error("Error adding avaSubject to Firestore:", error);
  }
};

export const updateAvaSubject = async (
  // avaSubjectId: string,
  avaSubject: AvaSubject
): Promise<void> => {
  try {
    const path = `${PATH}/${avaSubject.avaSubjectId}`;
    const data = avaSubject.toMap();
    await setData(path, data);
    console.log(`AvaSubject ${avaSubject.avaSubjectId} updated in Firestore`);
  } catch (error) {
    console.error(`Error setting avaSubject ${avaSubject.avaSubjectId} in Firestore:`, error);
  }
};


export const avaSubjectsStream = (onUpdate: (updatedData: AvaSubject[]) => void) => {
  const builder = (data: Record<string, any>, id: string) => AvaSubject.fromMap(data, id);

  let queryBuilder: ((query: Query<DocumentData>) => Query<DocumentData>) | undefined;

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
}