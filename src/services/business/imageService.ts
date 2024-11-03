import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore, storage } from "../../api/firebaseConfig";
import { handleError } from "../../utils/errorHandler";
import { uploadImageToStorage } from "../uploads/uploadImage";
import { PortfolioImage } from "../../types/firestore-types/portfolioImageTypes";
import { deleteObject, ref } from "firebase/storage";

// Check user role
export const checkUserRole = async (
  userId: string
): Promise<string | undefined> => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data().role || undefined;
    }
    return undefined;
  } catch (error) {
    handleError(error, "Error to check user role");
  }
};

/*////////////////////////////////////////////////////////////////////
///////////////////// ADD AND UPLOAD IMAGES //////////////////////////
////////////////////////////////////////////////////////////////////*/

// Function for processing profile images
export const addUpdateProfileImage = async (userId: string, file: Blob) => {
  try {
    const path = `users/${userId}/profileImage`; // Path to the storage
    const imageUrl = await uploadImageToStorage(file, path);

    // Update user's image with image's URL
    const userDocRef = doc(firestore, "users", userId);
    await setDoc(userDocRef, { profilePhoto: imageUrl }, { merge: true });
    console.log("User profile image uploaded successfully");
  } catch (error) {
    handleError(error, "Error to uploading user profile image");
  }
};

// Function for processing business images
export const addUpdateBusinessImage = async (
  userId: string,
  imageType: "businessLogo" | "coverImage",
  file: Blob
): Promise<string | undefined> => {
  const role = await checkUserRole(userId);

  if (role !== "owner" && role !== "admin") {
    console.error(
      "Only business owner or administrator can to upload business images."
    );
    return undefined;
  }

  const userDocRef = doc(firestore, "users", userId);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const businessId = userDoc.data().businessId;

    if (!businessId) {
      console.warn("No businessId associated with the user.");
    }

    try {
      const path = `businesses/${businessId}/${imageType}`;
      const imageUrl = await uploadImageToStorage(file, path);

      // Update business document with image's URL
      const businessDocRef = doc(firestore, "businesses", businessId);
      await setDoc(
        businessDocRef,
        { images: { [imageType]: imageUrl } },
        { merge: true }
      );

      console.log(`${imageType} uploaded successfully`);
      return imageUrl;
    } catch (error) {
      handleError(error, `Error uploading ${imageType}`);
      return undefined;
    }
  }
};

// Function for processing portfolio images
export const addUpdatePortfolioImages = async (
  images: { file: Blob; caption?: string }[],
  userId: string,
  targetEmployeeId?: string,
  targetLocationId?: string
) => {
  if (!userId) {
    console.error("User ID is missing.");
    return;
  }
  const userDocRef = doc(firestore, "users", userId);
  let userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const businessId = userDoc.data().businessId;
    const locationId = userDoc.data().locationId || targetLocationId || null;

    if (!businessId) {
      console.error("Business ID is missing.");
      return;
    }

    try {
      // Use Promise.all, to download multiple images
      const uploadPromises = images.map(async (image) => {
        const imageId = doc(collection(firestore, "portfolioImages")).id;
        const path = `portfolioImages/${businessId}/${imageId}`;
        const imageUrl = await uploadImageToStorage(image.file, path);

        const portfolioImageData: PortfolioImage = {
          imageId: imageId,
          uploadedBy: userId,
          businessId: businessId,
          targetLocationId: locationId,
          targetEmployeeId: targetEmployeeId ? targetEmployeeId : userId,
          imageUrl: imageUrl,
          caption: image.caption || "",
          likes: [],
          uploadedAt: Timestamp.now(),
        };

        const portfolioDocRef = doc(firestore, `portfolioImages`, imageId);
        await setDoc(portfolioDocRef, portfolioImageData, { merge: true });
      });

      await Promise.all(uploadPromises);

      console.log("Portfolio image uploaded successfully");
    } catch (error) {
      handleError(error, "Error uploading portfolio images");
    }
  }
};

/*////////////////////////////////////////////////////////////////////
///////////////////////// GET IMAGES /////////////////////////////////
////////////////////////////////////////////////////////////////////*/

// Function to get user profile image
export const getUserProfileImage = async (userId: string) => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.profilePhoto || null;
    } else {
      throw new Error("User profile not found");
    }
  } catch (error) {
    handleError(error, "Error fetching user profile image");
  }
};

// Function to get business profile images
export const getBusinessImages = async (businessId: string) => {
  try {
    const businessDocRef = doc(firestore, "businesses", businessId);
    const businessDoc = await getDoc(businessDocRef);

    if (businessDoc.exists()) {
      const businessData = businessDoc.data();
      return businessData.images || null;
    } else {
      throw new Error("Business not found");
    }
  } catch (error) {
    handleError(error, "Error fetching business images");
    return null;
  }
};

// Function to fetch portfolio images based on user role and business context
export const getFilteredPortfolioImages = async (
  userId: string,
  businessId: string
): Promise<PortfolioImage[]> => {
  try {
    const portfolioCollectionRef = collection(firestore, "portfolioImages");
    const userRole = await checkUserRole(userId);

    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);
    let user = userDoc.data();
    let q;

    // Base query to allwayst include portfolio images
    if (userRole === "owner" || userRole === "admin") {
      q = query(portfolioCollectionRef, where("businessId", "==", businessId));
    } else if (userRole === "employee") {
      // Employee see business images and their own images
      q = query(
        portfolioCollectionRef,
        where("targetLocationId", "==", user && user.locationId),
        where("targetEmployeeId", "==", userId)
      );
    } else {
      // if the role is not recognizsed, return an empty array
      return [];
    }

    const portfolioSnapshot = await getDocs(q);
    const portfolioImages = portfolioSnapshot.docs.map(
      (doc) => doc.data() as PortfolioImage
    );
    return portfolioImages;
  } catch (error) {
    handleError(error, "Error fetching filtered portfolio images");
    return [];
  }
};

/*////////////////////////////////////////////////////////////////////
///////////////////////// DELETE IMAGES //////////////////////////////
////////////////////////////////////////////////////////////////////*/

// Function to delete business images
export const deleteBusinessImage = async (
  businessId: string,
  imageType: "businessLogo" | "coverImage"
) => {
  try {
    const businessDocRef = doc(firestore, "businesses", businessId);
    const imagePath = `businesses/${businessId}/${imageType}`;
    console.log(imagePath);

    // Dzēšam attēlu no Firebase Storage
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);

    // Dzēšam attēla dokumentu no Firestore
    await updateDoc(businessDocRef, {
      [`images.${imageType}`]: deleteField(),
    });

    console.log(`${imageType} has been successfully deleted.`);
  } catch (error) {
    handleError(error, `Error deleting ${imageType}`);
  }
};

// Function to delete portfolio images
export const deletePortfolioImage = async (
  businessId: string,
  imageIds: string[]
) => {
  try {
    const deletePromises = imageIds.map(async (imageId) => {
      const imageDocRef = doc(firestore, "portfolioImages", imageId);
      const imagePath = `portfolioImages/${businessId}/${imageIds}`;
      const imageRef = ref(storage, imagePath);

      await deleteObject(imageRef);
      await deleteDoc(imageDocRef);
      console.log(`Portfolio image ${imageId} has been successfully deleted.`);
    });

    Promise.all(deletePromises);
  } catch (error) {
    handleError(error, "Error deleting portfolio image");
  }
};
