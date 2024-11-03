import {
  addDoc,
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
import {
  Location,
  OpeningHours,
} from "../../types/firestore-types/locationTypes";

// Add location
export const addLocation = async (
  businessId: string | null | undefined,
  locationData: Location
): Promise<string | null> => {
  if (!businessId) {
    console.error("Business ID is missing. Cannot add location");
    return null;
  }
  try {
    const locationCollectionRef = collection(
      firestore,
      `businesses/${businessId}/locations`
    );
    const newLocationRef = (await addDoc(locationCollectionRef, locationData))
      .id;

    console.log("New location added successfully with Id");
    return newLocationRef;
  } catch (error) {
    handleError(error, "Error adding new location");
    return null;
  }
};

// Update location
export const updateLocation = async (
  businessId: string,
  locationId: string,
  locationData: Location
) => {
  try {
    const locationDocRef = doc(
      firestore,
      `businesses/${businessId}/locations`,
      locationId
    );

    await setDoc(locationDocRef, locationData, { merge: true });

    console.log("Location updated successfully");
  } catch (error) {
    handleError(error, "Error uploading location data");
  }
};

// Get location
export const getLocations = async (
  businessId: string
): Promise<Location[] | null> => {
  try {
    const businessDocRef = doc(firestore, "businesses", businessId);
    const businessDoc = await getDoc(businessDocRef);
    if (!businessDoc.exists()) {
      throw new Error("Business not found");
    }

    const locationCollectionRef = collection(
      firestore,
      `businesses/${businessId}/locations`
    );
    const locationSnapshot = await getDocs(locationCollectionRef);

    if (locationSnapshot.empty) {
      return [];
    }

    return locationSnapshot.docs.map((doc) => ({
      locationId: doc.id,
      ...(doc.data() as Omit<Location, "id">),
    }));
  } catch (error) {
    handleError(error, "Error fetching location data");
    return [];
  }
};
