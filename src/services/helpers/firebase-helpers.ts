import { firestore } from "../../api/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Get user document from Firestore by user's ID
export const getUserDoc = async (userId: string) => {
  const userRef = doc(firestore, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    throw new Error(`User with ID ${userId} not found.`);
  }
};

// Update user's document with new data in Firestore
export const updateUserDoc = async (userId: string, newUserData: object) => {
  const userRef = doc(firestore, "users", userId);
  await updateDoc(userRef, newUserData);
};

// Create or update user's document in Firestore
export const setUserData = async (userId: string, userData: object) => {
  const userRef = doc(firestore, "users", userId);
  await setDoc(userRef, userData, { merge: true });
};
