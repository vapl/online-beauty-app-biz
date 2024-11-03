import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../authService";
import { firestore, functions } from "../../api/firebaseConfig";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { handleError } from "../../utils/errorHandler";
import { httpsCallable } from "firebase/functions";
import sendVerificationEmail from "./sendVerificationEmail";
import i18n from "../../i18n";
import { User } from "../../types/firestore-types/userTypes";

export const registerUser = async (
  props: User,
  password: string,
  role?: "owner" | "admin" | "employee" | "customer"
) => {
  const language = i18n.language;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      props.email,
      password
    );
    const user = userCredential.user;

    const userData = {
      userId: user.uid,
      name: props.name,
      surname: props.surname,
      email: user.email,
      role: role ? role : "owner",
      verified: user.emailVerified,
      isFirstLogin: true,
      createdAt: Timestamp.now(),
    };

    await setDoc(doc(firestore, "users", user.uid), userData);
    sendVerificationEmail(language);
    return user;
  } catch (error) {
    handleError(error, "Error registering user");
    throw error;
  }
};

// Start, Check if phone number exists
interface PhoneCheckRequest {
  phone: string;
}

export const isPhoneNumberExists = async (
  phone: string
): Promise<boolean | undefined> => {
  const checkPhoneNumber = httpsCallable<PhoneCheckRequest>(
    functions,
    "checkPhoneNumberExists"
  );
  try {
    const result = await checkPhoneNumber({ phone });

    const { exists } = result.data as { exists: boolean };
    if (exists) return true;
  } catch (error) {
    handleError(error, "Error checking phone number");
    return false;
  }
};
// end, Check if phone number exists
