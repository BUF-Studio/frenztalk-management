import {
  type DocumentData,
  type Query,
  query,
  where,
} from "firebase/firestore";
import { Student } from "../models/student";
import {
  addData,
  collectionStream,
  setData,
  deleteData,
} from "./service/firestoreService";

const PATH = "students";

export const addStudent = async (student: Student): Promise<string> => {
  try {
    const path = PATH;
    const data = student.toMap();
    const id = await addData(path, data);
    console.log("Student added to Firestore");
    return id;
  } catch (error) {
    console.error("Error adding student to Firestore:", error);
    throw error;
  }
};

export const updateStudent = async (
  // studentId: string,
  student: Student
): Promise<void> => {
  try {
    const path = `${PATH}/${student.id}`;
    const data = student.toMap();
    await setData(path, data);
    console.log(`Student ${student.id} updated in Firestore`);
  } catch (error) {
    console.error(`Error setting student ${student.id} in Firestore:`, error);
  }
};

export const deleteStudent = async (student: Student) => {
  try {
    const path = `${PATH}/${student.id}`;
    await deleteData(path);
    console.log(`Student ${student.id} deleted in Firestore`);
  } catch (error) {
    console.error(`Error deleting student ${student.id} in Firestore:`, error);
  }
};

export const studentsStream = (
  onUpdate: (updatedData: Student[]) => void,
  tutorId?: string | null
) => {
  const builder = (data: Record<string, any>, id: string) =>
    Student.fromMap(data, id);

  let queryBuilder:
    | ((query: Query<DocumentData>) => Query<DocumentData>)
    | undefined;

  // if (tutorId) {
  //   queryBuilder = (q: Query<DocumentData>) =>
  //     query(q, where("tutorId", "array-contains", tutorId));
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
