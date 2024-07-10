import { DocumentData, Query, query, where } from "firebase/firestore";
import { User } from "../models/user";
import {
  addData,
  collectionStream,
  documentStream,
  setData,
} from "./service/firestoreService";

const PATH = "users";

export const addUser = async (user: User): Promise<void> => {
  try {
    const path = PATH;
    const data = user.toMap();
    await addData(path, data);
    console.log("User added to Firestore");
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
};

export const updateUser = async (
  // id: string,
  user: User,
): Promise<void> => {
  try {
    const path = `${PATH}/${user.id}`;
    const data = user.toMap();
    await setData(path, data);
    console.log(`User ${user.id} updated in Firestore`);
  } catch (error) {
    console.error(`Error setting user ${user.id} in Firestore:`, error);
  }
};

export const usersStream = (onUpdate: (updatedData: User[]) => void) => {
  const builder = (data: Record<string, any>, id: string) =>
    User.fromMap(data, id);

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

export const userStream = (
  onUpdate: (updatedData: User) => void,
  id: string,
) => {
  const builder = (data: Record<string, any>, id: string) =>
    User.fromMap(data, id);

  const path = `${PATH}/${id}`;
  // Subscribe to the collection stream
  const unsubscribe = documentStream(
    path, // Firestore collection path
    builder,
    onUpdate,
  );
  // Cleanup function
  return () => unsubscribe();
};
