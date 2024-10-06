import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import AccountVerificationBanner from "../components/complete-setup-banner.component";
import styled, { useTheme } from "styled-components/native";
import * as Linking from "expo-linking";
import OnboardingBusinessSetupStack from "./OnboardingBusinessSetupStack";
import { UserContext } from "../context/UserProvider";
import LoadingSpinner from "../components/loading-spinner.component";
import DrawerNavigator from "./drawer-navigator/DrawerNavigator";
import { getUserData } from "../services/userService";
import Text from "../components/text.component";

interface UserData {
  firstLogin?: boolean;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  userLogo?: string;
  verified?: boolean;
}

const AppNavigator: React.FC = () => {
  const theme = useTheme();
  const userContext = useContext(UserContext);

  if (!userContext) return null;
  const { isAuthenticated, isLoading, isEmailVerified, firstLogin, user } =
    userContext;
  // const [userData, setUserData] = useState<UserData | null>(null);

  if (isLoading) return <LoadingSpinner />;

  const linking = {
    prefixes: [Linking.createURL("/"), "exp://"],
    config: {
      screens: {
        VerifyEmail: "verify-email",
        Login: "login",
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      {isAuthenticated ? (
        <>
          {firstLogin ? <OnboardingBusinessSetupStack /> : <DrawerNavigator />}
        </>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
