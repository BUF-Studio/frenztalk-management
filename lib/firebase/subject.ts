import {
  type DocumentData,
  type Query,
  query,
  where,
} from "firebase/firestore";
import {
  addData,
  collectionStream,
  deleteData,
  setData,
} from "./service/firestoreService";
import { Subject } from "../models/subject";

const PATH = "subjects";

export const addSubject = async (subject: Subject): Promise<void> => {
  try {
    const path = PATH;
    const data = subject.toMap();
    await addData(path, data);
    console.log("Subject added to Firestore");
  } catch (error) {
    console.error("Error adding subject to Firestore:", error);
  }
};

export const updateSubject = async (subject: Subject): Promise<void> => {
  try {
    const path = `${PATH}/${subject.id}`;
    const data = subject.toMap();
    await setData(path, data);
    console.log(`Subject ${subject.id} updated in Firestore`);
  } catch (error) {
    console.error(`Error setting subject ${subject.id} in Firestore:`, error);
  }
};

export const deleteSubject = async (subject: Subject) => {
  try {
    const path = `${PATH}/${subject.id}`;
    await deleteData(path);
    console.log(`Subject ${subject.id} deleted in Firestore`);
  } catch (error) {
    console.error(`Error deleting subject ${subject.id} in Firestore:`, error);
  }
};

export const subjectsStream = (onUpdate: (updatedData: Subject[]) => void) => {
  const builder = (data: Record<string, any>, id: string) =>
    Subject.fromMap(data, id);

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
    queryBuilder
  );
  // Cleanup function
  return () => unsubscribe();
};
