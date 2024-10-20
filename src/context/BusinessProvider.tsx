import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "./UserProvider";
import {
  getBusinessInfo,
  getBusinessInfoRealtime,
} from "../services/businessService";
import { BusinessInfoProps } from "../types/business";

interface BusinessContextProps {
  businessData: BusinessInfoProps | null;
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
  const [businessData, setBusinessData] = useState<BusinessInfoProps | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [completedSelections, setCompletedSelections] = useState<number>(0);
  const [totalSelections, setTotalSelections] = useState<number>(5);

  const user = userContext?.user ?? null;

  const queryFn = async (): Promise<BusinessInfoProps | null> => {
    if (!user) return null;
    const info = await getBusinessInfo(user.uid);
    return info ?? null;
  };

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    setIsError(false);

    const unsubscribe = getBusinessInfoRealtime(user.uid, (data) => {
      setBusinessData(data);
      calculateProfileCompletion(data); // Pārbaudi cik pabeigts profils
      setIsLoading(false);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Funkcija, kas aprēķina pabeigtības procentus
  const calculateProfileCompletion = (data: BusinessInfoProps | null) => {
    const items = [
      !!data?.businessName,
      !!data?.images?.businessLogo && !!data.images.coverImage,
      !!data?.location?.address &&
        !!data.location.country &&
        !!data.location.city,
      !!data?.openingHours?.monday?.start ||
        !!data?.openingHours?.tuesday?.start ||
        !!data?.openingHours?.wednesday?.start ||
        !!data?.openingHours?.thursday?.start ||
        !!data?.openingHours?.friday?.start ||
        !!data?.openingHours?.saturday?.start ||
        !!data?.openingHours?.sunday?.start,
      !!data?.socialLinks?.website ||
        !!data?.socialLinks?.facebook ||
        !!data?.socialLinks?.instagram ||
        !!data?.socialLinks?.X ||
        !!data?.socialLinks?.linkedin,
    ];

    const completed = items.filter(Boolean).length;
    setCompletedSelections(completed);
    setTotalSelections(items.length);
  };

  return (
    <BusinessContext.Provider
      value={{
        businessData,
        isLoading,
        isError,
        completedSelections,
        totalSelections,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};
