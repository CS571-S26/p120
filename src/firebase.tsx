// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpC75gZPxZv4yXNBeKsOLqLhbqyt_bm0c",
  authDomain: "checkpoint-a8fd6.firebaseapp.com",
  projectId: "checkpoint-a8fd6",
  storageBucket: "checkpoint-a8fd6.firebasestorage.app",
  messagingSenderId: "800403796781",
  appId: "1:800403796781:web:a75459ef270f46985c99a4",
  measurementId: "G-3B71MYPT7D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);