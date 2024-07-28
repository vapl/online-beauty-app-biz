import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigationTypes";
import OnboardingScreen from "../screens/onboardinig.screen";
import LoginScreen from "../screens/login.screen";
import RegisterScreen from "../screens/register.screen";
import PassRecoveryScreen from "../screens/pass-recovery.screen";
import RecoveryConfirmation from "../screens/recovery-confirmation.screen";

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PassRecovery"
          component={PassRecoveryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecoveryConfirmation"
          component={RecoveryConfirmation}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
