// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKnI_YZlEzcAFwhbfjVuu58g8uXfmFg4Q",
  authDomain: "mindquill-ucdavis.appspot.com",
  projectId: "mindquill-ucdavis",
  storageBucket: "mindquill-ucdavis.firebasestorage.app",
  messagingSenderId: "826093243203",
  appId: "1:826093243203:web:88b2946e68b7c716e8bdf6",
  measurementId: "G-Q53QMCDS03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app)
const db = getFirestore(app);


export {auth, db};