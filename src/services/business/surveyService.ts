import { firestore } from "../../api/firebaseConfig";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { Survey } from "../../types/firestore-types/surveyTypes";
import { handleError } from "../../utils/errorHandler";

// Create survey data
export const createSurveyData = async (
  surveyData: Omit<Survey, "createdAt">
) => {
  try {
    const surveyWithTimestamp: Survey = {
      ...surveyData,
      createdAt: FirebaseFirestore.Timestamp.now(),
    };

    if (!surveyData.userId || !surveyData.question) {
      throw new Error("User ID and question are required");
    }

    // Create data to the document
    await addDoc(collection(firestore, "surveys"), surveyWithTimestamp);
    console.log("Survey data created successfully!");
  } catch (error) {
    handleError(error, "Failed to save surey data");
  }
};
