import { firestore, storage } from "../api/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { BusinessInfoProps } from "../types/business";
import { handleError } from "../utils/errorHandler";
import { uploadImageAndGetURL } from "./uploadImage";
import { deleteObject, ref } from "firebase/storage";

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

// Add images
export const addBusinessImages = async (
  userId: string,
  imageData: BusinessInfoProps
) => {
  try {
    // Find user's document in the Firestore and get businessId
    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);
    const businessId = userDoc.exists() && userDoc.data()?.businessId;

    if (!businessId) {
      throw new Error("Business ID not found.");
    }

    // Get current images to avoid overwriting fields
    const businessDocRef = doc(firestore, "businessInformation", businessId);
    const businessDoc = await getDoc(businessDocRef);
    const currentImages = businessDoc.data()?.images || {};

    // If businessLogo image, download it and get URL
    let logoImageURL: string | undefined = imageData.images?.businessLogo;
    if (imageData.images?.businessLogo) {
      try {
        logoImageURL = await uploadImageAndGetURL(
          imageData.images.businessLogo,
          `business/${businessId}/logoImage`
        );
      } catch (error) {
        handleError(error, "Failed to upload logoImage");
      }
    }

    // If cover image, download it and get URL
    let coverImageURL: string | undefined = imageData.images?.coverImage;
    if (imageData.images?.coverImage) {
      try {
        coverImageURL = await uploadImageAndGetURL(
          imageData.images.coverImage,
          `business/${businessId}/coverImage`
        );
      } catch (error) {
        handleError(error, "Failed to upload cover image");
      }
    }

    // If portfolio images, download them, and get URL
    const portfolioImagesURLs = Array.isArray(imageData.images?.portfolioImages)
      ? await Promise.all(
          imageData.images?.portfolioImages.map((imageUri, index) =>
            uploadImageAndGetURL(
              imageUri,
              `business/${businessId}/portfolioImages/image${index + 1}`
            )
          )
        )
      : [];

    const validPortfolioImagesURLs = portfolioImagesURLs.filter(
      (url): url is string => url !== undefined
    );

    // Check if the value is undefined and if so, don't include it in the update
    const imagesToUpdate: any = { ...currentImages };

    // Pievienojam businessLogo tikai tad, ja tas nav undefined
    if (logoImageURL) {
      imagesToUpdate.businessLogo = logoImageURL;
    }
    if (coverImageURL) {
      imagesToUpdate.coverImage = coverImageURL;
    }
    if (validPortfolioImagesURLs) {
      imagesToUpdate.portfolioImages = portfolioImagesURLs;
    }

    await updateBusinessInfo(userId, {
      images: imagesToUpdate,
    });

    if (coverImageURL || logoImageURL || portfolioImagesURLs) {
      console.log("Images has been succesfully upadated!");
    }
  } catch (error) {
    handleError(error, "Error adding image.");
  }
};

// Function to delete business images
export const deleteBusinessImages = async (
  userId: string,
  imageType: "businessLogo" | "coverImage" | "portfolioImages",
  imageIndex?: number // Index for portfolio image if applicable
) => {
  try {
    // Find user's document in the Firestore and get businessId
    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);
    const businessId = userDoc.exists() && userDoc.data()?.businessId;

    if (!businessId) {
      throw new Error("Business ID not found.");
    }

    // Reference to the image in Firebase Storage
    const businessDocRef = doc(firestore, "businessInformation", businessId);
    const businessDoc = await getDoc(businessDocRef);
    const currentImages = businessDoc.data()?.images || {};
    // Get current images to avoid averwriting other fields
    let imagePath: string;
    let fieldToUpdate: any = { ...currentImages };

    if (imageType === "businessLogo") {
      imagePath = `business/${businessId}/logoImage`;
      fieldToUpdate.businessLogo = null;
    } else if (imageType === "coverImage") {
      imagePath = `business/${businessId}/coverImage`;
      fieldToUpdate.coverImage = null;
    } else if (
      imageType === "portfolioImages" &&
      typeof imageIndex === "number"
    ) {
      imagePath = `business/${businessId}/portfolioImages/image${
        imageIndex + 1
      }`;

      // Remove specific portfolio image
      const currentPortfolioImages =
        businessDoc.data()?.images?.portfolioImages || [];

      if (currentPortfolioImages.length > 0) {
        // Remove the image at the given index
        currentPortfolioImages.splice(imageIndex, 1);
        fieldToUpdate = { portfolioImages: currentPortfolioImages };
      }
    } else {
      throw new Error("Invalid image type or missing portfolio image index.");
    }

    // Delete the image from Firebase Storage
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);

    // Update Firestore by setting the image URL to null or updating portfolio images
    await updateDoc(businessDocRef, {
      images: fieldToUpdate,
    });

    console.log(`${imageType} has been successfully deleted.`);
  } catch (error) {
    handleError(error, `Error deleting ${imageType}`);
  }
};
