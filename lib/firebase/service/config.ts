// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

import "dotenv/config";

const config = {
  // apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,


  apiKey: "AIzaSyBeMHft0UJvCoz8T8IBZuzNaiW183Sg4gU",
  authDomain: "frenztalk.firebaseapp.com",
  projectId: "frenztalk",
  storageBucket: "frenztalk.appspot.com",
  messagingSenderId: "455866249052",
  appId: "1:455866249052:web:85516be003bd18097b9b99",
  measurementId: "G-2KEYB3YETG"
};

export const firebaseConfig = config;
