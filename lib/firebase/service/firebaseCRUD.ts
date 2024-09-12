import { db } from "./serverApp";

interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

async function getPaginatedData<T>(
    collection: string,
    page: number,
    pageSize: number
): Promise<PaginatedResult<T>> {
    const totalSnapshot = await db.collection(collection).count().get();
    const total = totalSnapshot.data().count;

    const snapshot = await db.collection(collection)
        .orderBy('createdAt', 'desc')
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .get();

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];

    return { data, total, page, pageSize };
}

async function getData<T>(collection: string): Promise<T[]> {
    try {
        const snapshot = await db.collection(collection).get();

        if (snapshot.empty) {
            console.log('No documents found in the collection.');
            return [];
        }

        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as T[];

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Failed to fetch data from Firebase');
    }
}
async function createDocument<T>(collection: string, data: T): Promise<string> {
    const docRef = await db.collection(collection).add({ ...data, createdAt: new Date() });
    return docRef.id;
}

async function setDocument<T>(collection: string, id: string, data: Partial<T>): Promise<void> {
    await db.collection(collection).doc(id).set(data);
}

async function deleteDocument(collection: string, id: string): Promise<void> {
    await db.collection(collection).doc(id).delete();
}

export { getPaginatedData, getData, createDocument, setDocument, deleteDocument };