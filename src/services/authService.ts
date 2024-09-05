import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User,
  sendEmailVerification,
  applyActionCode,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth, functions, firestore } from "../api/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import * as Google from "expo-auth-session/providers/google";
import {
  OAUTH_WEB_CLIENT_ID,
  OUTH_IOS_CLIENT_ID,
  OUTH_ANDROID_CLIENT_ID,
} from "@env";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { handleError } from "../utils/errorHandler";

interface RegisterUserProps {
  email: string;
  password: string;
  name: string;
  surname: string;
  phone: string;
  userRole?: "owner" | "employee";
  businessId?: string;
}

// Register new user
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
      userRole: props.userRole || "owner",
      profileImage: "",
      createdAt: new Date(),
      verified: false,
      firstLogin: true,
    };

    await setDoc(doc(firestore, "users", user.uid), userData);
    await sendEmailVerification(user);
    return user;
  } catch (error) {
    handleError(error, "Error sending verification link: ");
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

// Sign in with Google
const useGoogleSignIn = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: OAUTH_WEB_CLIENT_ID,
    iosClientId: OUTH_IOS_CLIENT_ID,
    androidClientId: OUTH_ANDROID_CLIENT_ID,
    redirectUri: `https://auth.expo.io/@vapl/online-beauty-app-biz`,
  });
  useEffect(() => {
    const signInWithGoogle = async () => {
      console.log("Google Sign-In Response: ", response);
      if (response?.type === "success") {
        const { id_token } = response.params;

        try {
          // Get Google credential
          const credential = GoogleAuthProvider.credential(id_token);
          const result = await signInWithCredential(auth, credential);
          const user = result.user;

          // Save or update user data in Firestore
          const userDocRef = doc(firestore, "users", user.uid);
          await setDoc(
            userDocRef,
            {
              name: user.displayName,
              email: user.email,
              profilePicture: user.photoURL,
              phone: user.phoneNumber,
            },
            { merge: true }
          );
        } catch (error) {
          handleError(error, "During Google Sign-In: ");
        }
      } else if (response?.type === "error") {
        handleError(response.error, "Error Sign-In Error: ");
      }
    };

    signInWithGoogle();
  }, [response]);

  return { promptAsync, request, response };
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
const sendVerificationEmail = async (user: User, language: string) => {
  try {
    // Set Firebase language
    auth.languageCode = language;
    await sendEmailVerification(user);
    return { success: true, message: "Verification email sent." };
  } catch (error) {
    handleError(error, "Error sending verification email: ");
    throw error;
  }
};

// Verify email link
const verifyEmailLink = async (oobCode: string): Promise<boolean> => {
  try {
    await applyActionCode(auth, oobCode);
    console.log("Email verified successfull");

    const user = auth.currentUser;
    if (user) {
      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, { verified: true });
    }
    return true;
  } catch (error: any) {
    console.error("Error verifying email:", error.message);

    // Pievienojiet specifisku kļūdu apstrādi
    if (error.code === "auth/invalid-action-code") {
      console.error("The verification code is invalid or expired.");
    } else if (error.code === "auth/user-disabled") {
      console.error(
        "The user corresponding to the provided code has been disabled."
      );
    } else {
      console.error("An unexpected error occurred during email verification.");
    }

    return false;
  }
};

// Check if email exists in Firebase Firestore
const checkIfEmailExists = async (email: string) => {
  const checkEmail = httpsCallable(functions, "checkIfEmailExists");
  try {
    const result = await checkEmail({ email });
    const { exists } = result.data as { exists: boolean }; // Extract the exists field
    if (exists) return true; // Return the boolean directly for simpler checks
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
  sendVerificationEmail,
  verifyEmailLink,
  auth,
  authStateListener,
  checkIfEmailExists,
  useGoogleSignIn,
};
