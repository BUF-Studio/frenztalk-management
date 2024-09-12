// import { type DocumentData, type Query, query, where } from "firebase/firestore";
// import { addData, collectionStream, setData } from "./service/firestoreService";
// import { Pricing } from "../models/pricing";

// const PATH = "pricings";

// export const addPricing = async (
//   pricing: Pricing,
// ): Promise<string> => {
//   try {
//     const path = PATH;
//     const data = pricing.toMap();
//     const id = await addData(path, data);
//     console.log("Pricing added to Firestore");
//     return id;
//   } catch (error) {
//     console.error("Error adding pricing to Firestore:", error);
//     throw error;
//   }
// };

// export const updatePricing = async (
//   pricing: Pricing,
// ): Promise<void> => {
//   try {
//     const path = `${PATH}/${pricing.id}`;
//     const data = pricing.toMap();
//     await setData(path, data);
//     console.log(`Education Level ${pricing.id} updated in Firestore`);
//   } catch (error) {
//     console.error(
//       `Error setting education ${pricing.id} in Firestore:`,
//       error,
//     );
//   }
// };

// export const pricingStream = (
//   onUpdate: (updatedData: Pricing[]) => void,
// ) => {
//   const builder = (data: Record<string, any>, id: string) =>
//     Pricing.fromMap(data, id);

//   let queryBuilder:
//     | ((query: Query<DocumentData>) => Query<DocumentData>)
//     | undefined;

//   // Subscribe to the collection stream
//   const unsubscribe = collectionStream(
//     PATH, // Firestore collection path
//     builder,
//     onUpdate,
//     queryBuilder,
//   );
//   // Cleanup function
//   return () => unsubscribe();
// };
