// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDtClfUR3WtTbtq6dPagm0O0mcTRsbdCFc",
    authDomain: "apcsa-fp-1ad07.firebaseapp.com",
    projectId: "apcsa-fp-1ad07",
    storageBucket: "apcsa-fp-1ad07.firebasestorage.app",
    messagingSenderId: "991171474672",
    appId: "1:991171474672:web:5d5a8c5ba43780b89c3e35"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);
