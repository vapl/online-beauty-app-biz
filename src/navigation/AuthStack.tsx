import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigationTypes";
import OnboardingScreen from "../screens/onboarding-screens/onboardinig.screen";
import LoginScreen from "../screens/auth-screens/login.screen";
import RegisterScreen from "../screens/auth-screens/register.screen";
import PassRecoveryScreen from "../screens/auth-screens/pass-recovery.screen";
import RecoveryConfirmationScreen from "../screens/auth-screens/recovery-confirmation.screen";
import NewPasswordScreen from "../screens/auth-screens/new-password.screen";
import VerifyEmailScreen from "../screens/auth-screens/verify.email.screen";

const Stack = createStackNavigator<RootStackParamList>();

const AuthStack: React.FC = () => {
  return (
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
        component={RecoveryConfirmationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewPassword"
        component={NewPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
