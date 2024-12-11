// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from 'firebase/firestore/lite';
// import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB55a_t4n0ezKuvi_B_Bw-Ctz_I3HeP7_0",
  authDomain: "webdevproject2-f8e75.firebaseapp.com",
  projectId: "webdevproject2-f8e75",
  storageBucket: "webdevproject2-f8e75.firebasestorage.app",
  messagingSenderId: "28828395847",
  appId: "1:28828395847:web:f1eb5995d2c3a0d619c462",
  measurementId: "G-5GXBCGY6ES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const database = getFirestore(app);

//const auth = getAuth(app);
