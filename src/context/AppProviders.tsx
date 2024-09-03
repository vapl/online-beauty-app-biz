import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./UserProvider";
import { BusinessProvider } from "./BusinessProvider";

const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BusinessProvider>{children}</BusinessProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
