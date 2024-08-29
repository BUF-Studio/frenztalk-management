import { auth, db } from './serverApp';

import type { NextRequest } from 'next/server';

export async function verifyAuthAndGetRole(request: NextRequest) {
  const token = request.cookies.get('session')?.value;

  if (!token) {
    return { user: null, role: null };
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      console.error("User document does not exist");
      return { user: decodedToken, role: null };
    }

    const userData = userDoc.data();
    return { user: decodedToken, role: userData?.role };
  } catch (error) {
    console.error("Error verifying token or fetching user data:", error);
    return { user: null, role: null };
  }
}