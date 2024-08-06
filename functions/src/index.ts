/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    /* firebase functions:config:set
    email.user="valdis.vascenkovs@gmail.com"
    email.pass="tpGUBn!31M6l*/
    user: "valdis.vascenkovs@gmail.com", // functions.config().email.user,
    pass: "tpGUBn!31M6l", // functions.config().email.pass,
  },
});

exports.sendVerificationCode = functions.https.onCall(async (data) => {
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
      throw new functions.https.HttpsError("internal", "Unable to send email.");
    }
  } else if (phone) {
    // Send SMS, use for example Twilio
  }

  return { success: true };
});
