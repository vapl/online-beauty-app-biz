// src/types/navigationTypes.ts

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Definējiet Stack parametru sarakstu
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  PassRecovery: undefined;
  RecoveryConfirmation: { email?: string; phone?: string } | undefined;
  NewPassword: undefined;
  Main: undefined;
  AccountSetupBusinessName: undefined;
};

// Navigācijas props tips katram ekrānam
export type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;
export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;
export type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register"
>;
export type PassRecoveryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PassRecovery"
>;
export type RecoveryConfirmationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RecoveryConfirmation"
>;
export type NewPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "NewPassword"
>;
export type MainScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Main"
>;
export type AccountSetupBusinessNameScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AccountSetupBusinessName"
>;

// Ekrāna props tips katram ekrānam
export type OnboardingScreenProps = {
  navigation: OnboardingScreenNavigationProp;
  route: RouteProp<RootStackParamList, "Onboarding">;
};

export type LoginScreenProps = {
  navigation: LoginScreenNavigationProp;
  route: RouteProp<RootStackParamList, "Login">;
};

export type RegisterScreenProps = {
  navigation: RegisterScreenNavigationProp;
  route: RouteProp<RootStackParamList, "Register">;
};

export type PassRecoveryScreenProps = {
  navigation: PassRecoveryScreenNavigationProp;
  route: RouteProp<RootStackParamList, "PassRecovery">;
};

export type RecoveryConfirmationScreenProps = {
  navigation: RecoveryConfirmationScreenNavigationProp;
  route: RouteProp<RootStackParamList, "RecoveryConfirmation">;
};

export type NewPasswordScreenProps = {
  navigation: NewPasswordScreenNavigationProp;
  route: RouteProp<RootStackParamList, "NewPassword">;
};

export type MainScreenProps = {
  navigation: MainScreenNavigationProp;
  route: RouteProp<RootStackParamList, "Main">;
};

export type AccountSetupBusinessNameScreenProps = {
  navigation: AccountSetupBusinessNameScreenNavigationProp;
  route: RouteProp<RootStackParamList, "AccountSetupBusinessName">;
};
