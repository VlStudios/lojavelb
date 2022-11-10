import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBOHJvXn9nNa8p8PurnkzmVwQXh7q_5aGs",
  authDomain: "lojavelb.firebaseapp.com",
  projectId: "lojavelb",
  storageBucket: "lojavelb.appspot.com",
  messagingSenderId: "852158021134",
  appId: "1:852158021134:web:741beedb8a69df27f4c65f",
  measurementId: "G-0C770RC1FT"
};

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();
const analytics = getAnalytics();

export { auth, db, storage, analytics };
