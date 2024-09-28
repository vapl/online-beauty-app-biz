import { firestore } from "../api/firebaseConfig";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { SurveyProps } from "../types/surveys";
import { handleError } from "../utils/errorHandler";

// Create survey data
export const createSurveyData = async (surveyData: SurveyProps) => {
  try {
    // Create data to the document
    await addDoc(collection(firestore, "surveys"), surveyData);
    console.log("Survey data created successfully!");
  } catch (error) {
    handleError(error, "Failed to save surey data");
  }
};
