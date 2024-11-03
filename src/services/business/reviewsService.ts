import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../../api/firebaseConfig";
import { handleError } from "../../utils/errorHandler";
import { uploadImageToStorage } from "../uploads/uploadImage";
import { Review } from "../../types/firestore-types/reviewTypes";

/*////////////////////////////////////////////////////////////////////
///////////////////////// UPLOAD REVIEWS ///////////////////////////////
//////////////////////////////////////////////////////////////////////*/

// Function for adding new reviews
export const addReview = async (
  authorId: string,
  targetId: string,
  targetType: "business" | "location" | "employee",
  rating: number,
  reviewText: string
): Promise<void> => {
  try {
    const reviewId = doc(collection(firestore, "reviews")).id;

    const reviewData: Review = {
      reviewId,
      authorId,
      targetId,
      targetType,
      rating,
      reviewText,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const reviewDocRef = doc(firestore, "reviews", reviewId);
    await setDoc(reviewDocRef, reviewData, { merge: true });

    console.log("Review uploaded successfully");
  } catch (error) {
    handleError(error, "Error uploading a review");
  }
};

// Function for updating reviews
export const updateReview = async (
  reviewId: string,
  raiting?: number,
  reviewText?: string
): Promise<void> => {
  try {
    const revieDocRef = doc(firestore, "reviews", reviewId);
    const existingReviews = await getDoc(revieDocRef);

    if (!existingReviews.exists) {
      throw new Error("Review not found, cannot update.");
    }

    const updateData: Partial<Review> = {
      ...(raiting && { raiting }),
      ...(reviewText && { reviewText }),
      updatedAt: Timestamp.now(),
    };

    console.log("Review updated succesfully!");
  } catch (error) {
    handleError(error, "Error updating review");
  }
};

// Function to get reviews
export const getReview = async (
  targetId: string,
  targetType: "business" | "location" | "employee"
): Promise<Review[]> => {
  try {
    const reviewCollectionRef = collection(firestore, "reviews");
    const q = query(
      reviewCollectionRef,
      where("targetId", "==", targetId),
      where("targetId", "==", targetType)
    );

    const reviewSnapshot = await getDocs(q);
    const reviews: Review[] = reviewSnapshot.docs.map(
      (doc) => doc.data() as Review
    );
    return reviews;
  } catch (error) {
    handleError(error, "Error fetching review");
    return [];
  }
};
