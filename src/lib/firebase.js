import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApjvxJKu8eX4SHMGNqnPjgYfNA6kU9RJ0",
  authDomain: "kryon-ai.firebaseapp.com",
  projectId: "kryon-ai",
  storageBucket: "kryon-ai.firebasestorage.app",
  messagingSenderId: "1044519521968",
  appId: "1:1044519521968:web:a5e3754dc77c3efe46b575"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

