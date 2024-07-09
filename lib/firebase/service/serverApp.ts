// enforces that this code can only be called on the server
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment
import "server-only";

import * as admin from "firebase-admin";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import { firebaseAdminConfig } from "./config";

const serviceAccount = JSON.parse(firebaseAdminConfig || "{}");

export const firebaseAdminApp =
  getApps().length === 0
    ? initializeApp({
        credential: admin.credential.cert({
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
        }),
      })
    : getApps()[0];

export const auth = getAuth(firebaseAdminApp);