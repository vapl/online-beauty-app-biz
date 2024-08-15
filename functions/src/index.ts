/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

interface RegisterUserProps {
  email: string;
  password: string;
  name: string;
  surname: string;
  userType: "client" | "specialist";
}

// Register user function
export const registerUser = functions.https.onCall(
  async (data: RegisterUserProps) => {
    const { email, password, name, surname, userType } = data;
    console.log("Registering user with email:", email);

    try {
      // Create the user with Firebase Authentication
      const userCredential = await admin.auth().createUser({ email, password });
      const user = userCredential;

      console.log("User created successfully with UID:", user.uid);

      // Prepare user data to save in Firestore
      const userData = {
        email: user.email,
        name: name,
        surname: surname,
        userType: userType,
        profileImage: "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Save user data in Firestore under the 'users' collection using UID as the document ID
      await admin.firestore().collection("users").doc(user.uid).set(userData);

      console.log("User data saved in Firestore.");

      return { uid: user.uid, email: user.email };
    } catch (error: any) {
      if (error.code === "auth/email-already-exists") {
        throw new functions.https.HttpsError(
          "already-exists",
          "The email is already in use by another account"
        );
      } else if (error.code === "auth/invalid-password") {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "The email is already in use by another account"
        );
      } else {
        throw new functions.https.HttpsError("internal", error.message);
      }
    }
  }
);

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    /* firebase functions:config:set
    email.user='valdis.vascenkovs@gmail.com'
    email.pass='tpGUBn!31M6l*/
    user: "valdis.vascenkovs@gmail.com", // functions.config().email.user,
    pass: "tpGUBn!31M6l", // functions.config().email.pass,
  },
});

export const sendVerificationCode = functions
  .region("europe-west1")
  .https.onCall(async (data) => {
    const { email, phone } = data;

    // Generate 4 digits code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Save the code with user's ID
    await admin
      .firestore()
      .collection("verificationCodes")
      .doc(email || phone)
      .set({
        code: verificationCode,
        timeStamp: admin.firestore.FieldValue.serverTimestamp(),
      });

    // Send the code to email or phone
    if (email) {
      // send the code to the email
      const mailOptions = {
        from: "valdis.vascenkovs@gmail.com",
        to: email,
        subject: "Your Verification Code from Online Beauty",
        text: `Your verification code is ${verificationCode}`,
      };
      console.log(verificationCode);

      try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        throw new functions.https.HttpsError(
          "internal",
          "Unable to send email."
        );
      }
    } else if (phone) {
      // Send SMS, use for example Twilio
    }

    return { success: true };
  });

export const checkIfEmailExists = functions
  .region("europe-west1")
  .https.onCall(async (data) => {
    const { email } = data;

    try {
      const userRef = admin
        .firestore()
        .collection("users")
        .where("email", "==", email);
      const userSnapshot = await userRef.get();

      return { exists: !userSnapshot.empty };
    } catch (error: any) {
      throw new functions.https.HttpsError(
        "internal",
        "Unable to check email.",
        error.message
      );
    }
  });
