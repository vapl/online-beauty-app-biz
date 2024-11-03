import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../api/firebaseConfig"; // Firebase konfigurācijas imports
import { handleError } from "../../utils/errorHandler";

// Funkcija, lai augšupielādētu attēlu Storage un atgrieztu URL
export const uploadImageAndGetURL = async (
  imageBlob: Blob,
  path: string
): Promise<string> => {
  const storageRef = ref(storage, path); // Izveidojam atsauci uz Firebase Storage
  await uploadBytes(storageRef, imageBlob); // Augšupielādējam Blob objektu Firebase Storage
  const downloadURL = await getDownloadURL(storageRef); // Iegūstam lejupielādes URL
  return downloadURL;
};

export const uploadImageToStorage = async (
  file: Blob,
  path: string
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file); // Augšupielādē failu
    const downloadURL = await getDownloadURL(storageRef); // Iegūst URL
    return downloadURL;
  } catch (error) {
    handleError(error, "Error uploading image");
    throw error;
  }
};
