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
      setIsLoading(false);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // const { data, isLoading, isError } = useQuery<
  //   BusinessInfoProps | null,
  //   Error
  // >({ queryKey: ["businessData", user?.uid], queryFn, enabled: !!user });

  // const businessData = data ?? null;

  return (
    <BusinessContext.Provider value={{ businessData, isLoading, isError }}>
      {children}
    </BusinessContext.Provider>
  );
};
