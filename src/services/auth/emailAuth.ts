import { httpsCallable } from "firebase/functions";
import { functions } from "../../api/firebaseConfig";
import { handleError } from "../../utils/errorHandler";

// Check if email exists in Firebase Firestore
export const checkIfEmailExists = async (email: string) => {
  const checkEmail = httpsCallable(functions, "checkIfEmailExists");
  try {
    const result = await checkEmail({ email });
    const { exists } = result.data as { exists: boolean }; // Extract the exists field
    if (exists) return true; // Return the boolean directly for simpler checks
  } catch (error: any) {
    handleError(error, "Error checking email");
    console.error("Error checking email:", error.message || "Unknown error");
    return false; // Assume the email doesn't exist if there's an error
  }
};
