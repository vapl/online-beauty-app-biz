import { sendEmailVerification } from "firebase/auth";
import { handleError } from "../../utils/errorHandler";
import { auth } from "../authService";

const sendVerificationEmail = async (language?: string) => {
  const user = auth.currentUser;
  try {
    if (!user) throw new Error("No authenticated user found");

    if (language) {
      auth.languageCode = language || null;
    }
    await sendEmailVerification(user);
    return { success: true, message: "Verification email has been sent" };
  } catch (error) {
    handleError(error, "Failed to send verification email");
    return { success: false, message: (error as Error).message };
  }
};

export default sendVerificationEmail;
