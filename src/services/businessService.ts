import { firestore } from "../api/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { BusinessInfoProps } from "../types/business";
import { handleError } from "../utils/errorHandler";

// Update business information
export const updateBusinessInfo = async (
  userId: string,
  businessData: BusinessInfoProps
) => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);

    let businessId = userDoc.exists() && userDoc.data()?.businessId;

    if (businessId) {
      const businessDocRef = doc(firestore, "businessInformation", businessId);
      await setDoc(businessDocRef, businessData, { merge: true });
      console.log("Business information updated successfully!");
    } else {
      businessId = doc(collection(firestore, "businessInformation")).id;
      const newBusinessDocRef = doc(
        firestore,
        "businessInformation",
        businessId
      );
      await setDoc(newBusinessDocRef, { ...businessData, ownerId: userId });

      await setDoc(
        userDocRef,
        {
          businessId: businessId,
        },
        { merge: true }
      );
      console.log(
        "New business created and businessId updated in the user's document!"
      );
    }
  } catch (error) {
    handleError(error, "Error updating business information");
  }
};

// Get business information from the Firestore
export const getBusinessInfo = async (
  userId: string
): Promise<BusinessInfoProps | null> => {
  try {
    // fetch businessId from the user document
    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);
    const businessId = userDoc.exists() ? userDoc.data()?.businessId : null;
    if (businessId) {
      const businessDataDocRef = doc(
        firestore,
        "businessInformation",
        businessId
      );
      const businessInfoDoc = await getDoc(businessDataDocRef);

      if (businessInfoDoc.exists()) {
        return businessInfoDoc.data() as BusinessInfoProps;
      }
    }
    return null;
  } catch (error) {
    handleError(error, "Error fetching business information");
    return null;
  }
};

export const getBusinessInfoRealtime = (
  userId: string,
  callback: (data: BusinessInfoProps | null) => void
): (() => void) | null => {
  try {
    const userDocRef = doc(firestore, "users", userId);

    return onSnapshot(userDocRef, (userDoc) => {
      const businessId = userDoc.exists() ? userDoc.data()?.businessId : null;
      if (businessId) {
        const businessDataDocRef = doc(
          firestore,
          "businessInformation",
          businessId
        );

        // Klausīties uz biznesa datu izmaiņām
        return onSnapshot(businessDataDocRef, (businessInfoDoc) => {
          if (businessInfoDoc.exists()) {
            callback(businessInfoDoc.data() as BusinessInfoProps);
          } else {
            callback(null);
          }
        });
      }
    });
  } catch (error) {
    handleError(error, "Error fetching business information in realtime");
    return null;
  }
};
