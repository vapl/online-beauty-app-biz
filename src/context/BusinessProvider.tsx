import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserContext } from "./UserProvider";
import { loadBusinessInfoWithRealtimeUpdates } from "../services/business/businessService";
import { Business } from "../types/firestore-types/businessTypes";
import { Location } from "../types/firestore-types/locationTypes";
import { getLocations } from "../services/business/locationService";
import { PortfolioImage } from "../types/firestore-types/portfolioImageTypes";
import { getFilteredPortfolioImages } from "../services/business/imageService";

interface BusinessContextProps {
  businessData: Business | null;
  portfolioImages: PortfolioImage[] | null;
  locationData: Location | Location[] | null;
  isLoading: boolean;
  isError: boolean;
  completedSelections: number;
  totalSelections: number;
}

export const BusinessContext = createContext<BusinessContextProps | undefined>(
  undefined
);

export const BusinessProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const userContext = useContext(UserContext);
  const { isLoading: userLoading, userProfile, user } = userContext || {};
  const [businessData, setBusinessData] = useState<Business | null>(null);
  const [locationData, setLocationData] = useState<
    Location | Location[] | null
  >(null);
  const [portfolioImages, setPortfolioImages] = useState<
    PortfolioImage[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [completedSelections, setCompletedSelections] = useState<number>(0);
  const [totalSelections, setTotalSelections] = useState<number>(5);

  useEffect(() => {
    const userId = userContext?.user?.uid;
    if (!userId) return;

    if (!userProfile || !userProfile.businessId) {
      console.warn("User profile or business ID is missing.");
      return;
    }
    const { businessId } = userProfile;

    if (!businessId) {
      console.warn("Business ID is missing after profile load.");
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const unsubscribe = loadBusinessInfoWithRealtimeUpdates(
          userId,
          (data) => {
            setBusinessData(data || null);
          }
        );

        // Get business locations
        const locations = await getLocations(businessId);
        setLocationData(locations);
        if (!locations) setIsError(true);

        // Get filtered portfolio images
        if (!userProfile?.role) return;
        const filteredPortfolioImages = await getFilteredPortfolioImages(
          userId,
          businessId
        );
        setPortfolioImages(filteredPortfolioImages);
        if (filteredPortfolioImages.length === 0) setIsError(true);

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userContext?.userProfile]);

  useEffect(() => {
    if (
      businessData &&
      Array.isArray(locationData) &&
      locationData.length > 0
    ) {
      calculateProfileCompletion(businessData, locationData[0]);
    }
  }, [businessData, locationData]);

  // Profila pabeigtības aprēķins
  const calculateProfileCompletion = (
    data: Business,
    locationData?: Location
  ) => {
    const checks = {
      hasImages: !!data.images?.businessLogo && !!data.images.coverImage,
      hasLegalInformation:
        !!data.businessName &&
        !!data.phone &&
        !!data.email &&
        data.legalAddress?.address,
      hasLocation: data.onsiteService ? true : !!data.locations?.length,
      hasOpeningHours: data.onsiteService ? true : !!locationData?.openingHours,
      hasSocialLinks:
        !!data.socialLinks?.website ||
        !!data.socialLinks?.facebook ||
        !!data.socialLinks?.instagram,
      hasServices: (data.services?.length ?? 0) >= 5,
    };

    const completed = Object.values(checks).filter(Boolean).length;
    setCompletedSelections(completed);
    setTotalSelections(Object.keys(checks).length);
  };

  return (
    <BusinessContext.Provider
      value={{
        businessData,
        isLoading,
        isError,
        completedSelections,
        totalSelections,
        locationData,
        portfolioImages,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};
