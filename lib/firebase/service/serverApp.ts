import * as admin from "firebase-admin";

const serviceAccount = require("@/frenztalk-firebase-adminsdk-h68uw-8c7b585859.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      //   {
      //   projectId: process.env.FIREBASE_PROJECT_ID,
      //   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      //   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      // }
      serviceAccount
    ),
  });
}

export const auth = admin.auth();
export const db = admin.firestore();
