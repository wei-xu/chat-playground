import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBzRSRb88rzxQrlnKLvNm3gSr-b2cyLFA4",
  authDomain: "chat-playground-9c284.firebaseapp.com",
  projectId: "chat-playground-9c284",
  storageBucket: "chat-playground-9c284.appspot.com",
  messagingSenderId: "953624974519",
  appId: "1:953624974519:web:3c13db05a6b9e56c91a932",
  measurementId: "G-R4DM1YYYD4",
};

const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const db = getFirestore(FIREBASE_APP);

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
