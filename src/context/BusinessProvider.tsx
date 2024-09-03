import React, { createContext, ReactNode, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "./UserProvider";
import { getBusinessInfo } from "../services/businessService";
import { BusinessInfoProps } from "../types/business";

interface BusinessContextProps {
  businessInfo: BusinessInfoProps | null;
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

  if (!userContext || !userContext.user) {
    return (
      <BusinessContext.Provider
        value={{ businessInfo: null, isLoading: false, isError: true }}
      >
        {children}
      </BusinessContext.Provider>
    );
  }

  const { user } = userContext;

  const queryFn = async (): Promise<BusinessInfoProps | null> => {
    const info = await getBusinessInfo(user.uid);
    return info ?? null;
  };

  const { data, isLoading, isError } = useQuery<
    BusinessInfoProps | null,
    Error
  >({ queryKey: ["businessInfo", user.uid], queryFn, enabled: !!user });

  const businessInfo = data ?? null;

  return (
    <BusinessContext.Provider value={{ businessInfo, isLoading, isError }}>
      {children}
    </BusinessContext.Provider>
  );
};