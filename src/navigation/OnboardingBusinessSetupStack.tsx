import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  AppStackNavigationProp,
  RootStackParamList,
} from "../types/navigationTypes";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";
import { Text } from "../components/text.component";
import { CommonActions, useNavigation } from "@react-navigation/native";
import AccountSetupBusinessNameScreen from "../screens/account-setup-screens/account-setup-business-name.screen";
import AccountSetupServicesScreen from "../screens/account-setup-screens/account-setup-services.screen";
import AccountSetupTeamScreen from "../screens/account-setup-screens/account-setup-team.screen";
import AccountSetupLocationScreen from "../screens/account-setup-screens/account-setup-location.screen";
import { UserContext } from "../context/UserProvider";
import { updateUser } from "../services/userService";
import AppStack from "./AppStack";
import SetupStatusBanner from "../components/complete-setup-banner.component";

const Stack = createStackNavigator<RootStackParamList>();

const OnboardingBusinessSetupStack: React.FC = () => {
  const userContext = useContext(UserContext);
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<AppStackNavigationProp>();

  if (!userContext) return;
  const { user } = userContext;

  const handleSkipSettings = async () => {
    if (!user) return;

    try {
      await updateUser(user.uid, { firstLogin: false });
      userContext.firstLogin = false;

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "AppStack" }],
        })
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <Stack.Navigator
      initialRouteName="AccountSetupBusinessName"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="AccountSetupBusinessName"
        component={AccountSetupBusinessNameScreen}
        options={{
          title: t("account_settings"),
          headerRight: () => (
            <Text
              fontVariant="buttonMedium"
              color={theme.colors.secondary.dark}
              textAlign="right"
              onPress={handleSkipSettings}
              style={{ marginRight: theme.space.md }}
            >
              {t("skip")}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="AccountSetupServices"
        component={AccountSetupServicesScreen}
        options={{
          title: t("account_settings"),
          headerRight: () => (
            <Text
              fontVariant="buttonMedium"
              color={theme.colors.secondary.dark}
              textAlign="right"
              onPress={handleSkipSettings}
              style={{ marginRight: theme.space.md }}
            >
              {t("skip")}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="AccountSetupTeam"
        component={AccountSetupTeamScreen}
        options={{
          title: t("account_settings"),
          headerRight: () => (
            <Text
              fontVariant="buttonMedium"
              color={theme.colors.secondary.dark}
              textAlign="right"
              onPress={handleSkipSettings}
              style={{ marginRight: theme.space.md }}
            >
              {t("skip")}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="AccountSetupLocation"
        component={AccountSetupLocationScreen}
        options={{
          title: t("account_settings"),
          headerRight: () => (
            <Text
              fontVariant="buttonMedium"
              color={theme.colors.secondary.dark}
              textAlign="right"
              onPress={handleSkipSettings}
              style={{ marginRight: theme.space.md }}
            >
              {t("skip")}
            </Text>
          ),
        }}
      />

      <Stack.Screen
        name="AppStack"
        component={() => (
          <>
            <SetupStatusBanner />
            <AppStack />
          </>
        )}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default OnboardingBusinessSetupStack;
