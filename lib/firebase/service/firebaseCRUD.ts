import PaginatedResult from "@/lib/models/paginationResult";
import { db } from "./serverApp";


export interface QueryFilter {
    field: string;
    operator: FirebaseFirestore.WhereFilterOp;
    value: any;
}

async function getPaginatedData<T>(
    collection: string,
    page: number,
    pageSize: number,
    query?: QueryFilter | null | undefined
): Promise<PaginatedResult<T>> {
    let ref = db.collection(collection);
    let queryRef: FirebaseFirestore.Query = ref;

    if (query) {
        queryRef = ref.where(query.field, query.operator, query.value);
    }

    const totalSnapshot = await queryRef.count().get();
    const total = totalSnapshot.data().count;

    const snapshot = await queryRef
        // .orderBy('createdAt', 'desc')
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .get();

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];

    return { data, total, page, pageSize };
}

async function getData<T>(collection: string, id: string): Promise<T | null> {
    try {
        const docRef = db.collection(collection).doc(id);
        const doc = await docRef.get();


        if (!doc.exists) {
            console.log('No document found with the given ID.');
            return null;
        }

        return {
            id: doc.id,
            ...doc.data()
        } as T;


    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Failed to fetch data from Firebase');
    }
}
async function createDocument<T>(collection: string, data: T): Promise<string> {
    const docRef = await db.collection(collection).add({ ...data, createdAt: new Date() });
    return docRef.id;
}

async function updateDocument<T>(collection: string, id: string, data: Partial<T>): Promise<void> {
    await db.collection(collection).doc(id).update(data);
}

async function deleteDocument(collection: string, id: string): Promise<void> {
    await db.collection(collection).doc(id).delete();
}

export { getPaginatedData, getData, createDocument, updateDocument, deleteDocument };