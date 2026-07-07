// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyAzp8erTrG4iBMoV0OcM-uD2sai13t06O8",
  authDomain: "event-app-d0d94.firebaseapp.com",
  projectId: "event-app-d0d94",
  storageBucket: "event-app-d0d94.firebasestorage.app",
  messagingSenderId: "351539734200",
  appId: "1:351539734200:web:61a71cf5e4d172c358f64d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);