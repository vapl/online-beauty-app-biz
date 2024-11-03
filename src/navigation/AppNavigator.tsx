import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import { useTheme } from "styled-components/native";
import * as Linking from "expo-linking";
import OnboardingBusinessSetupStack from "./OnboardingBusinessSetupStack";
import { UserContext } from "../context/UserProvider";
import LoadingSpinner from "../components/loading-spinner.component";
import DrawerNavigator from "./drawer-navigator/DrawerNavigator";

const AppNavigator: React.FC = () => {
  const userContext = useContext(UserContext);

  if (!userContext) return null;
  const { isAuthenticated, isLoading, isFirstLogin } = userContext;
  // const [userData, setUserData] = useState<UserData | null>(null);

  <LoadingSpinner isLoading={isLoading} />;

  const linking = {
    prefixes: [Linking.createURL("/"), "exp://"],
    config: {
      screens: {
        VerifyEmail: "verify-email",
        Login: "login",
      },
    },
  };

  if (isLoading) {
    return <LoadingSpinner isLoading={true} />;
  }

  return (
    <NavigationContainer linking={linking}>
      {isAuthenticated ? (
        <>
          {isFirstLogin ? (
            <OnboardingBusinessSetupStack />
          ) : (
            <DrawerNavigator />
          )}
        </>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
