import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  AccountSetupBusinessNameScreenNavigationProp,
  AppStackParamList,
  RootStackParamList,
} from "../types/navigationTypes";
import MainScreen from "../screens/main-screens/main.screen";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import OnboardingBusinessSetupStack from "./OnboardingBusinessSetupStack";

const Stack = createStackNavigator<AppStackParamList>();

const AppStack: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
