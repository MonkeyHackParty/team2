
import firebase from "firebase/compat/app";
import "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

export const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_DOMAIN,
    databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};


export const fb = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

export default fb;
