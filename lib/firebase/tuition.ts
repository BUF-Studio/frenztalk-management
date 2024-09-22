import { type DocumentData, type Query, query, where } from "firebase/firestore";
import { addData, collectionStream, setData, deleteData } from "./service/firestoreService";
import { Tuition } from "../models/tuition";

const PATH = "tuitions";

export const addTuition = async (
    tuition: Tuition,
): Promise<string> => {
    try {
        const path = PATH;
        const data = tuition.toMap();
        const id = await addData(path, data);
        console.log("Tuition added to Firestore");
        return id;
    } catch (error) {
        console.error("Error adding tuition to Firestore:", error);

        throw error;
    }
};

export const deleteTuition = async (tuition: Tuition) => {
    try {
        const path = `${PATH}/${tuition.id}`;
        await deleteData(path);
        console.log(`Tuition ${tuition.id} deleted in Firestore`);
    } catch (error) {
        console.error(`Error deleting tuition ${tuition.id} in Firestore:`, error);
    }
};

export const updateTuition = async (
    // id: string,
    tuition: Tuition,
): Promise<void> => {
    try {
        const path = `${PATH}/${tuition.id}`;
        const data = tuition.toMap();
        await setData(path, data);
        console.log(`Tuition ${tuition.id} updated in Firestore`);
    } catch (error) {
        console.error(
            `Error setting tuition ${tuition.id} in Firestore:`,
            error,
        );
    }
};

export const tuitionsStream = (
    onUpdate: (updatedData: Tuition[]) => void,
    // history: boolean,
    tutorId?: string | null,
) => {
    const builder = (data: Record<string, any>, id: string) =>
        Tuition.fromMap(data, id);

    let queryBuilder:
        | ((query: Query<DocumentData>) => Query<DocumentData>)
        | undefined;

    // queryBuilder = (q: Query<DocumentData>) => query(q, where('status', history ? '==' : '!=', 'end'));

    if (tutorId) {
        queryBuilder = (q: Query<DocumentData>) => query(q, where('tutorId', '==', tutorId));
    }

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
