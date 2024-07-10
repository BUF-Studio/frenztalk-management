import { Tutor } from "../models/tutor";
import { addData, collectionStream, setData } from "./service/firestoreService";

const PATH = "tutors";

export const addTutor = async (tutor: Tutor): Promise<void> => {
  try {
    const path = PATH;
    const data = tutor.toMap();
    await addData(path, data);
    console.log("Tutor added to Firestore");
  } catch (error) {
    console.error("Error adding tutor to Firestore:", error);
  }
};

export const setTutor = async (
  // id: string,
  tutor: Tutor,
): Promise<void> => {
  try {
    const path = `${PATH}/${tutor.id}`;
    const data = tutor.toMap();
    await setData(path, data);
    console.log(`Tutor ${tutor.id} updated in Firestore`);
  } catch (error) {
    console.error(`Error setting tutor ${tutor.id} in Firestore:`, error);
  }
};

export const tutorsStream = (onUpdate: (updatedData: Tutor[]) => void) => {
  const builder = (data: Record<string, any>, id: string) =>
    Tutor.fromMap(data, id);

  // Subscribe to the collection stream
  const unsubscribe = collectionStream(
    PATH, // Firestore collection path
    builder,
    onUpdate,
  );
  // Cleanup function
  return () => unsubscribe();
};
