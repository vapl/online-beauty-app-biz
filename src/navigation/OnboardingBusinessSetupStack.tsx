import React, { useContext, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigationTypes";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";
import Text from "../components/text.component";
import AccountSetupBusinessNameScreen from "../screens/account-setup-screens/account-setup-business-name.screen";
import AccountSetupServicesScreen from "../screens/account-setup-screens/account-setup-services.screen";
import AccountSetupTeamScreen from "../screens/account-setup-screens/account-setup-team.screen";
import AccountSetupLocationScreen from "../screens/account-setup-screens/account-setup-location.screen";
import AccountSetupLocationConfirmationScreen from "../screens/account-setup-screens/account-setup-location-confirmation.screen";
import AccountSetupSurveyScreen from "../screens/account-setup-screens/account-setup-survey.screen";
import { UserContext } from "../context/UserProvider";
import { updateUser } from "../services/userService";
import { handleError } from "../utils/errorHandler";

const Stack = createStackNavigator<RootStackParamList>();

const OnboardingBusinessSetupStack: React.FC = () => {
  const userContext = useContext(UserContext);
  const theme = useTheme();
  const { t } = useTranslation();

  if (!userContext) return;
  const { user } = userContext;

  const handleSkipSettings = async () => {
    if (!user) return;

    try {
      userContext.setFirstLogin(false);
      await updateUser(user.uid, { firstLogin: false });
    } catch (error) {
      handleError(error, "Fetching user data:");
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
        headerLeftContainerStyle: {
          paddingLeft: 6,
          marginLeft: 0,
        },
        headerRightContainerStyle: {
          paddingRight: theme.space.md,
        },
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
              textColor={theme.colors.secondary.dark}
              textAlign="right"
              onPress={handleSkipSettings}
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
              textColor={theme.colors.secondary.dark}
              textAlign="right"
              onPress={handleSkipSettings}
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
              textColor={theme.colors.secondary.dark}
              textAlign="right"
              onPress={handleSkipSettings}
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
              textColor={theme.colors.secondary.dark}
              textAlign="right"
              onPress={handleSkipSettings}
            >
              {t("skip")}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="AccountSetupLocationConfirmation"
        component={AccountSetupLocationConfirmationScreen}
        options={{
          title: t("account_settings"),
          headerRight: () => (
            <Text
              fontVariant="buttonMedium"
              textColor={theme.colors.secondary.dark}
              textAlign="right"
              onPress={handleSkipSettings}
            >
              {t("skip")}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="AccountSetupSurvey"
        component={AccountSetupSurveyScreen}
        options={{
          title: t("account_settings"),
          headerRight: () => (
            <Text
              fontVariant="buttonMedium"
              textColor={theme.colors.secondary.dark}
              textAlign="right"
              onPress={handleSkipSettings}
            >
              {t("skip")}
            </Text>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default OnboardingBusinessSetupStack;
