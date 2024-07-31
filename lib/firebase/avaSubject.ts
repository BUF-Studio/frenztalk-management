import { type DocumentData, type Query, query, where } from "firebase/firestore";
import { addData, collectionStream, setData } from "./service/firestoreService";
import { Level } from "../models/level";

const PATH = "levels";

export const addLevel = async (
  level: Level,
): Promise<string> => {
  try {
    const path = PATH;
    const data = level.toMap();
    const id = await addData(path, data);
    console.log("Level added to Firestore");
    return id;
  } catch (error) {
    console.error("Error adding level to Firestore:", error);

    throw error;
  }
};

export const updateLevel = async (
  // id: string,
  level: Level,
): Promise<void> => {
  try {
    const path = `${PATH}/${level.id}`;
    const data = level.toMap();
    await setData(path, data);
    console.log(`Level ${level.id} updated in Firestore`);
  } catch (error) {
    console.error(
      `Error setting level ${level.id} in Firestore:`,
      error,
    );
  }
};

export const levelsStream = (
  onUpdate: (updatedData: Level[]) => void,
) => {
  const builder = (data: Record<string, any>, id: string) =>
    Level.fromMap(data, id);

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
