import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../api/firebaseConfig";
import { handleError } from "../utils/errorHandler";

export const uploadImageAndGetURL = async (imageUri: string, path: string) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    handleError(error, "Error uloading image");
  }
};
