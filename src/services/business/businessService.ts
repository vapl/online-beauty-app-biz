import { firestore, storage } from "../../api/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  BreakProps,
  OpeningHoursProps,
  ReservationProps,
  ReviewProps,
  ServiceProps,
  VacationProps,
} from "../../types/firestore-types/business";
import { handleError } from "../../utils/errorHandler";
import { Business } from "../../types/firestore-types/businessTypes";

// Update business information
export const updateBusinessInfo = async (
  userId: string,
  businessData: Business
) => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();

    if (userData.role !== "owner" && userData.role !== "admin") {
      throw new Error(
        "You do not have permitions to update business information"
      );
    }

    let businessId = userData.businessId;

    if (businessId) {
      const businessDocRef = doc(firestore, "businesses", businessId);
      await setDoc(businessDocRef, businessData, { merge: true });
      console.log("Business information updated successfully!");
    } else {
      businessId = doc(collection(firestore, "businesses")).id;
      const newBusinessDocRef = doc(firestore, "businesses", businessId);
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
): Promise<Business | null> => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);
    const businessId = userDoc.exists() ? userDoc.data()?.businessId : null;

    if (businessId) {
      const businessDataDocRef = doc(firestore, "businesses", businessId);
      const businessInfoDoc = await getDoc(businessDataDocRef);
      const businessData = businessInfoDoc.data() as Business;

      return businessData;
    }

    return null;
  } catch (error) {
    handleError(error, "Error fetching business information");
    return null;
  }
};

export const getBusinessInfoRealtime = (
  userId: string,
  callback: (data: Business | null) => void
): (() => void) | null => {
  try {
    const userDocRef = doc(firestore, "users", userId);

    let unsubscribeBusinessData: (() => void) | null = null;

    // Klausīties uz lietotāja dokumentu izmaiņām
    const unsubscribeUser = onSnapshot(userDocRef, (userDoc) => {
      const businessId = userDoc.exists() ? userDoc.data()?.businessId : null;

      // Ja iepriekšējais klausītājs uz biznesa datiem eksistē, to atceļam
      if (unsubscribeBusinessData) {
        unsubscribeBusinessData();
      }

      if (businessId) {
        const businessDataDocRef = doc(firestore, "businesses", businessId);

        // Klausīties uz biznesa dokumenta izmaiņām
        unsubscribeBusinessData = onSnapshot(
          businessDataDocRef,
          (businessInfoDoc) => {
            if (businessInfoDoc.exists()) {
              callback(businessInfoDoc.data() as Business);
            } else {
              callback(null);
            }
          }
        );
      } else {
        callback(null);
      }
    });

    // Atgriež funkciju, kas atceļ abus klausītājus, kad tie vairs nav vajadzīgi
    return () => {
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeBusinessData) unsubscribeBusinessData();
    };
  } catch (error) {
    handleError(error, "Error fetching business information in realtime");
    return null;
  }
};

export const loadBusinessInfoWithRealtimeUpdates = (
  userId: string,
  callback: (data: Business | null) => void
): (() => void) | null => {
  try {
    let unsubscribe: (() => void) | null = null;

    // Sākotnēji iegūstam vienreizējus datus
    getBusinessInfo(userId).then((initialData) => {
      if (initialData) {
        callback(initialData); // Sākotnējie dati tiek nodoti callback funkcijai
      }

      // Aktivizējam reāllaika klausītāju
      unsubscribe = getBusinessInfoRealtime(userId, (realtimeData) => {
        callback(realtimeData); // Reāllaika dati tiek nodoti callback funkcijai
      });
    });

    // Atgriežam klausītāja atcelšanas funkciju, vai null, ja tā netiek inicializēta
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  } catch (error) {
    handleError(
      error,
      "Error fetching business information with realtime updates"
    );
    return null;
  }
};

// *** SET OR UPDATE SERVICES FUNCTION ***
export const setOrUpdateService = async (
  businessId: string,
  serviceId: string,
  serviceData: ServiceProps
) => {
  try {
    const serviceDocRef = doc(
      firestore,
      "businesses",
      businessId,
      "services",
      serviceId
    );

    const serviceDocSnap = await getDoc(serviceDocRef);

    if (serviceDocSnap.exists()) {
      // Ja dokuments eksistē, atjaunojam datus
      await updateDoc(serviceDocRef, serviceData);
      console.log("Service updated successfully!");
    } else {
      // Ja dokuments neeksistē, izveidojam to
      await setDoc(serviceDocRef, serviceData, { merge: true });
      console.log("Service added successfully!");
    }
  } catch (error) {
    handleError(error, "Error setting or updating service");
  }
};

// *** SET OR UPDATE RESERVATION FUNCTION ***
export const setOrUpdateReservation = async (
  businessId: string,
  reservationId: string | null, // Ja reservationId ir null, pievienojam jaunu rezervāciju
  reservationData: ReservationProps
) => {
  try {
    let reservationDocRef;

    if (reservationId) {
      // Ja ir norādīts reservationId, atjaunojam esošu rezervāciju
      reservationDocRef = doc(
        firestore,
        "businesses",
        businessId,
        "reservations",
        reservationId
      );
    } else {
      // Ja reservationId nav norādīts, pievienojam jaunu rezervāciju
      reservationDocRef = doc(
        collection(firestore, "businesses", businessId, "reservations")
      );
    }

    const reservationDocSnap = await getDoc(reservationDocRef);

    if (reservationDocSnap.exists()) {
      // Ja dokuments eksistē, atjaunojam datus
      await updateDoc(reservationDocRef, reservationData);
      console.log("Reservation updated successfully!");
    } else {
      // Ja dokuments neeksistē, izveidojam jaunu rezervāciju
      await setDoc(reservationDocRef, reservationData, { merge: true });
      console.log("Reservation added successfully!");
    }
  } catch (error) {
    handleError(error, "Error setting or updating reservation");
  }
};

// *** ADD OR UPDATE EMPLOYEE BREAK FUNCTION ***
export const setOrUpdateEmployeeBreak = async (
  businessId: string,
  locationId: string,
  employeeId: string,
  breakId: string,
  breakData: BreakProps
) => {
  try {
    const breakDocRef = doc(
      firestore,
      "businesses",
      businessId,
      "businessLocations",
      locationId,
      "employees",
      employeeId,
      "employeeBreaks",
      breakId
    );

    const breakDocSnap = await getDoc(breakDocRef);

    if (breakDocSnap.exists()) {
      // Ja dokuments eksistē, atjaunojam datus
      await updateDoc(breakDocRef, breakData);
      console.log("Employee break updated successfully!");
    } else {
      // Ja dokuments neeksistē, izveidojam to
      await setDoc(breakDocRef, breakData, { merge: true });
      console.log("Employee break added successfully!");
    }
  } catch (error) {
    handleError(error, "Error setting or updating employee break");
  }
};

// *** ADD OR UPDATE EMPLOYEE VACATION FUNCTION ***
export const setOrUpdateEmployeeVacation = async (
  businessId: string,
  locationId: string,
  employeeId: string,
  vacationId: string,
  vacationData: VacationProps
) => {
  try {
    const vacationDocRef = doc(
      firestore,
      "businesses",
      businessId,
      "businessLocations",
      locationId,
      "employees",
      employeeId,
      "employeeVacations",
      vacationId
    );

    const vacationDocSnap = await getDoc(vacationDocRef);

    if (vacationDocSnap.exists()) {
      // Atjaunojam atvaļinājuma datus
      await updateDoc(vacationDocRef, vacationData);
      console.log("Employee vacation updated successfully!");
    } else {
      // Izveidojam jaunu ierakstu
      await setDoc(vacationDocRef, vacationData, { merge: true });
      console.log("Employee vacation added successfully!");
    }
  } catch (error) {
    handleError(error, "Error setting or updating employee vacation");
  }
};

// *** ADD OR UPDATE RAITING AND REVIEW FUNCTION ***
export const setOrUpdateEmployeeReview = async (
  businessId: string,
  locationId: string,
  employeeId: string,
  reviewId: string,
  reviewData: ReviewProps
) => {
  try {
    const reviewDocRef = doc(
      firestore,
      "businesses",
      businessId,
      "businessLocations",
      locationId,
      "employees",
      employeeId,
      "employeeReviews",
      reviewId
    );

    const reviewDocSnap = await getDoc(reviewDocRef);

    if (reviewDocSnap.exists()) {
      // Atjaunojam atsauksmes datus
      await updateDoc(reviewDocRef, reviewData);
      console.log("Employee review updated successfully!");
    } else {
      // Izveidojam jaunu atsauksmi
      await setDoc(reviewDocRef, reviewData, { merge: true });
      console.log("Employee review added successfully!");
    }
  } catch (error) {
    handleError(error, "Error setting or updating employee review");
  }
};

// *** ADD OR UPDATE EMPLOYEE WORKING HOURS ***
export const setOrUpdateEmployeeWorkingHours = async (
  businessId: string,
  locationId: string,
  employeeId: string,
  workingHours: OpeningHoursProps
) => {
  try {
    const employeeDocRef = doc(
      firestore,
      "businesses",
      businessId,
      "businessLocations",
      locationId,
      "employees",
      employeeId
    );

    // Pārbaudām, vai dokuments eksistē
    const employeeDocSnap = await getDoc(employeeDocRef);

    if (employeeDocSnap.exists()) {
      // Ja dokuments eksistē, mēs to atjauninām
      await updateDoc(employeeDocRef, { workingHours });
      console.log("Employee working hours updated successfully!");
    } else {
      // Ja dokuments neeksistē, mēs to izveidojam, izmantojot setDoc
      await setDoc(employeeDocRef, { workingHours }, { merge: true });
      console.log("Employee working hours added successfully!");
    }
  } catch (error) {
    handleError(error, "Error setting or updating working hours");
  }
};
