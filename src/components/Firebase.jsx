// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjl-dVK5kPpZTHuUjiX6vScOgK0DxEbZo",
  authDomain: "visual-ai-a2f55.firebaseapp.com",
  projectId: "visual-ai-a2f55",
  storageBucket: "visual-ai-a2f55.firebasestorage.app",
  messagingSenderId: "451324059011",
  appId: "1:451324059011:web:553a71163d5d08dfbe6ab6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db=getFirestore(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to LOCAL storage");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });
  
export default {app, db};