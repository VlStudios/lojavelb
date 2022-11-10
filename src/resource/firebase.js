// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOHJvXn9nNa8p8PurnkzmVwQXh7q_5aGs",
  authDomain: "lojavelb.firebaseapp.com",
  projectId: "lojavelb",
  storageBucket: "lojavelb.appspot.com",
  messagingSenderId: "852158021134",
  appId: "1:852158021134:web:741beedb8a69df27f4c65f",
  measurementId: "G-0C770RC1FT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);