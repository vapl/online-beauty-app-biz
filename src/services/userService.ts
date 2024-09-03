import { auth, firestore } from "../api/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";

interface UserData {
  firstLogin?: boolean;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  verified?: boolean;
}

// Get user data
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const user: User | null = auth.currentUser; // Iegūst pašreizējo autentificēto lietotāju
    if (user) {
      const userRef = doc(firestore, "users", user.uid); // Norāda uz lietotāja dokumentu
      const userSnap = await getDoc(userRef); // Iegūst dokumenta datus

      if (userSnap.exists()) {
        const userData = userSnap.data() as UserData; // Iegūst dokumenta datus kā objektu ar UserData tipu
        return userData; // Atgriež lietotāja datus
      } else {
        console.error("No such document!");
        return null;
      }
    } else {
      console.error("No user is logged in");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
    return null;
  }
};

// Update user data
export const updateUser = async (
  userId: string,
  updateData: Partial<UserData>
): Promise<void> => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    await setDoc(userDocRef, updateData, { merge: true });
    console.log("User data updated successfully");
  } catch (error) {
    console.error("Error updating user data: ", error);
    throw error;
  }
};
