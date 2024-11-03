/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

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

export const checkPhoneNumberExists = functions
  .region("europe-west1")
  .https.onCall(async (data) => {
    const { phone } = data;
    console.log("Received phone number:", phone);
    try {
      const userRef = admin
        .firestore()
        .collection("users")
        .where("phone", "==", phone);
      const querySnapshot = await userRef.get();
      console.log(
        "Query result:",
        querySnapshot.empty ? "No phone found" : "Phone exists"
      );
      return {
        exists: !querySnapshot.empty,
      };
    } catch (error: any) {
      throw new functions.https.HttpsError(
        "internal",
        "Unable to check phone.",
        error.message
      );
    }
  });
