import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import AccountVerificationBanner from "../components/complete-setup-banner.component";
import { SafeAreaView } from "react-native";
import styled, { useTheme } from "styled-components/native";
import * as Linking from "expo-linking";
import OnboardingBusinessSetupStack from "./OnboardingBusinessSetupStack";
import { UserContext } from "../context/UserProvider";
import LoadingSpinner from "../components/loading.spinner";

const SafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const AppNavigator: React.FC = () => {
  const theme = useTheme();
  const userContext = useContext(UserContext);

  if (!userContext) return null;
  const { firstLogin, isAuthenticated, isLoading, isEmailVerified, user } =
    userContext;
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
          <SafeArea>
            {firstLogin ? (
              <OnboardingBusinessSetupStack />
            ) : (
              <>
                {!isEmailVerified && <AccountVerificationBanner />}
                <AppStack />
              </>
            )}
          </SafeArea>
        </>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
