import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import { httpsCallable, getFunctions } from "firebase/functions";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions();

// Register user function
const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Login user function
const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Logout user function
const logoutUser = () => {
  return signOut(auth);
};

// Listenere function to get authentificated user or not.
const authStateListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Send verification code function
const sendVerificationCode = async (email?: string, phone?: string) => {
  const sendCode = httpsCallable(functions, "sendVerificationCode");
  try {
    const result = await sendCode({ email, phone });
    return result.data;
  } catch (error) {
    throw error;
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  auth,
  authStateListener,
  sendVerificationCode,
};
