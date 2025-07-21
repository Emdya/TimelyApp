import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ❌ DO NOT use initializeAuth()
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // ✅ This works fine in Expo
export const db = getFirestore(app);
