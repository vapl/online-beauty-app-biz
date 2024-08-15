import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyB4uAda6fK5KI8rQLXQZW93jz1AILaSI78",
  authDomain: "onlinebeautyapp-e572d.firebaseapp.com",
  projectId: "onlinebeautyapp-e572d",
  storageBucket: "onlinebeautyapp-e572d.appspot.com",
  messagingSenderId: "796785992105",
  appId: "1:796785992105:web:516582b0f183812c05e4b8",
  measurementId: "G-0CDE7PVD83",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const functions = getFunctions(app);

export { app, auth, firestore, functions };
