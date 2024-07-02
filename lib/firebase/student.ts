import { Student } from "../models/student";
import { addData, collectionStream, documentStream, setData, } from "./service/firestoreService";

const PATH = "students";

export const addStudent = async (
  student: Student
): Promise<void> => {
  try {
    const path = PATH
    const data = student.toMap();
    await addData(path, data);
    console.log("Student added to Firestore");
  } catch (error) {
    console.error("Error adding student to Firestore:", error);
  }
};

export const updateStudent = async (
  // studentId: string,
  student: Student
): Promise<void> => {
  try {
    const path = `${PATH}/${student.studentId}`;
    const data = student.toMap();
    await setData(path, data);
    console.log(`Student ${student.studentId} updated in Firestore`);
  } catch (error) {
    console.error(`Error setting student ${student.studentId} in Firestore:`, error);
  }
};

export const studentsStream = (onUpdate: (updatedData: Student[]) => void,) => {
  const builder = (data: Record<string, any>, id: string) => Student.fromMap(data, id);


  // Subscribe to the collection stream
  const unsubscribe = collectionStream(
    PATH, // Firestore collection path
    builder,
    onUpdate,
  );
  // Cleanup function
  return () => unsubscribe();
}
