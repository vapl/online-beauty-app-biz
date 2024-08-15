import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signOut,
  onAuthStateChanged,
  User,
  signInWithEmailLink,
} from "firebase/auth";
import { auth, functions, firestore } from "./firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { doc, setDoc } from "firebase/firestore";

interface VerificationCodeResponse {
  success: boolean;
  message?: string;
}

interface RegisterUserProps {
  email: string;
  password: string;
  name: string;
  surname: string;
  phone: string;
  userType?: string;
}

const registerUser = async (props: RegisterUserProps) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      props.email,
      props.password
    );
    const user = userCredential.user;

    const userData = {
      email: user.email,
      name: props.name,
      surname: props.surname,
      phone: props.phone,
      userType: props.userType,
      profileImage: "",
      createdAt: new Date(),
      verified: false,
    };

    await setDoc(doc(firestore, "users", user.uid), userData);
    return user;
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

// Listener function to get authentificated user or not.
const authStateListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Send password reset email function
const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset email sent" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

//Send email verification function
const sendEmailVerification = async (
  email: string
): Promise<VerificationCodeResponse> => {
  const actionCodeSettings = {
    url: "http://172.20.10.2:8081/new-password",
    handleCodeInApp: true,
  };
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    return { success: true, message: "Verification email sent." };
  } catch (error) {
    throw error;
  }
};

// Verify email link
const verifyEmailLink = async (email: string, emailLink: string) => {
  try {
    if (isSignInWithEmailLink(auth, emailLink)) {
      await signInWithEmailLink(auth, email, emailLink);
      return { success: true, message: "Email verified" };
    } else {
      throw new Error("Invalid email link");
    }
  } catch (error) {
    throw error;
  }
};

// Check if email exists in Firebase Firestore
const checkIfEmailExists = async (email: string) => {
  const checkEmail = httpsCallable(functions, "checkIfEmailExists");
  try {
    const result = await checkEmail({ email });
    const { exists } = result.data as { exists: boolean }; // Extract the exists field
    return exists; // Return the boolean directly for simpler checks
  } catch (error: any) {
    console.error("Error checking email:", error.message || "Unknown error");
    return false; // Assume the email doesn't exist if there's an error
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  sendEmailVerification,
  verifyEmailLink,
  auth,
  authStateListener,
  checkIfEmailExists,
};
