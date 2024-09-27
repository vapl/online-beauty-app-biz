// src/types/navigationTypes.ts

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define AppStackParamList for nested navigation
export type AppStackParamList = {
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

// Definējiet Stack parametru sarakstu
export type RootStackParamList = {
  AppStack: undefined;
  AuthStack: undefined;
  OnboardingBusinessSetupStack: undefined;

  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  PassRecovery: undefined;
  RecoveryConfirmation: { email?: string; phone?: string } | undefined;
  NewPassword: undefined;
  AccountSetupBusinessName: undefined;
  AccountSetupLocation: undefined;
  AccountSetupLocationConfirmation:
    | {
        hasLocation: boolean;
        address: string;
        city: string;
        country: string;
        parish: string;
        postalCode: string;
      }
    | undefined;
  AccountSetupServices: undefined;
  AccountSetupTeam: undefined;
  VerifyEmail: { url: string };
};

// Navigācijas props tips katram ekrānam
export type AppStackNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AppStack"
>;
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
  AppStackParamList,
  "Main"
>;
export type AccountSetupBusinessNameScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AccountSetupBusinessName"
>;
export type AccountSetupLocationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AccountSetupLocation"
>;
export type AccountSetupLocationConfirmationScreenNavigationProp =
  StackNavigationProp<RootStackParamList, "AccountSetupLocationConfirmation">;
export type AccountSetupServicesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AccountSetupServices"
>;
export type AccountSetupTeamScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AccountSetupTeam"
>;
export type VerifyEmailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "VerifyEmail"
>;

// Ekrāna props tips katram ekrānam
export type AppStackScreenProps = {
  navigation: AppStackNavigationProp;
  route: RouteProp<RootStackParamList, "AppStack">;
};

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
  route: RouteProp<AppStackParamList, "Main">;
};

export type AccountSetupBusinessNameScreenProps = {
  navigation: AccountSetupBusinessNameScreenNavigationProp;
  route: RouteProp<RootStackParamList, "AccountSetupBusinessName">;
};

export type AccountSetupLocationScreenProps = {
  navigation: AccountSetupLocationScreenNavigationProp;
  route: RouteProp<RootStackParamList, "AccountSetupLocation">;
};

export type AccountSetupLocationConfirmationScreenProps = {
  navigation: AccountSetupLocationConfirmationScreenNavigationProp;
  route: RouteProp<RootStackParamList, "AccountSetupLocationConfirmation">;
};

export type AccountSetupServicesScreenProps = {
  navigation: AccountSetupServicesScreenNavigationProp;
  route: RouteProp<RootStackParamList, "AccountSetupServices">;
};

export type AccountSetupTeamScreenProps = {
  navigation: AccountSetupTeamScreenNavigationProp;
  route: RouteProp<RootStackParamList, "AccountSetupTeam">;
};

export type VerifyEmailScreenProps = {
  navigation: VerifyEmailScreenNavigationProp;
  route: RouteProp<RootStackParamList, "VerifyEmail">;
};
