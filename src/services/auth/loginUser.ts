import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../api/firebaseConfig";
import { handleError } from "../../utils/errorHandler";

// Login user function
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    handleError(error, "Failed to login");
  }
};

// Logout user function
export const logoutUser = () => {
  return signOut(auth);
};
