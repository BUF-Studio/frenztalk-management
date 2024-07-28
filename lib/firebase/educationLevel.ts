import { type DocumentData, type Query, query, where } from "firebase/firestore";
import { addData, collectionStream, setData } from "./service/firestoreService";
import { EducationLevel } from "../models/educationLevel";

const PATH = "educationLevels";

export const addEducationLevel = async (
  educationLevel: EducationLevel,
): Promise<string> => {
  try {
    const path = PATH;
    const data = educationLevel.toMap();
    const id = await addData(path, data);
    console.log("EducationLevel added to Firestore");
    return id;
  } catch (error) {
    console.error("Error adding avaSubject to Firestore:", error);
    throw error;
  }
};

export const updateEducationLevel = async (
  educationLevel: EducationLevel,
): Promise<void> => {
  try {
    const path = `${PATH}/${educationLevel.id}`;
    const data = educationLevel.toMap();
    await setData(path, data);
    console.log(`Education Level ${educationLevel.id} updated in Firestore`);
  } catch (error) {
    console.error(
      `Error setting education ${educationLevel.id} in Firestore:`,
      error,
    );
  }
};

export const educationLevelStream = (
  onUpdate: (updatedData: EducationLevel[]) => void,
) => {
  const builder = (data: Record<string, any>, id: string) =>
    EducationLevel.fromMap(data, id);

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
