// src/types/navigationTypes.ts

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

// Define AppStackParamList for nested navigation
export type AppStackParamList = {
  Main: undefined;
};

// Drawer navigation parameter list
export type DrawerParamList = {
  BusinessProfile: undefined;
  UserProfile: undefined;
  Services: undefined;
  Marketing: undefined;
  OnlineRezervations: undefined;
  Team: undefined;
  Statistics: undefined;
  PaymentsAndBilling: undefined;
  Support: undefined;
};

export type TabParamList = {
  Appointments: undefined;
  Clients: undefined;
  Checkout: undefined;
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
        address?: string;
        city?: string;
        country?: string;
        parish?: string;
        postalCode?: string;
      }
    | undefined;
  AccountSetupSurvey: undefined;
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
export type AccountSetupSurveyNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AccountSetupTeam"
>;
export type VerifyEmailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "VerifyEmail"
>;

// Drawer navigation props
export type BusinessProfileNavigationProp = DrawerNavigationProp<
  DrawerParamList,
  "BusinessProfile"
>;
export type UserProfileNavigationProp = DrawerNavigationProp<
  DrawerParamList,
  "UserProfile"
>;
export type ServicesNavigationProp = DrawerNavigationProp<
  DrawerParamList,
  "Services"
>;
export type MarketingNavigationProp = DrawerNavigationProp<
  DrawerParamList,
  "Marketing"
>;
export type OnlineRezervationsNavigationProp = DrawerNavigationProp<
  DrawerParamList,
  "OnlineRezervations"
>;
export type TeamNavigationProp = DrawerNavigationProp<DrawerParamList, "Team">;
export type StatisticsNavigationProp = DrawerNavigationProp<
  DrawerParamList,
  "Statistics"
>;
export type PaymentsAndBillingNavigationProp = DrawerNavigationProp<
  DrawerParamList,
  "PaymentsAndBilling"
>;
export type SupportNavigationProp = DrawerNavigationProp<
  DrawerParamList,
  "Support"
>;

// Tab navigation props
export type AppointmentsNavigationProp = BottomTabNavigationProp<
  TabParamList,
  "Appointments"
>;
export type ClientsNavigationProp = DrawerNavigationProp<
  TabParamList,
  "Clients"
>;
export type CheckoutNavigationProp = DrawerNavigationProp<
  TabParamList,
  "Checkout"
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

export type AccountSetupSurveyScreenProps = {
  navigation: AccountSetupSurveyNavigationProp;
  route: RouteProp<RootStackParamList, "AccountSetupSurvey">;
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

// Drawer screen props
export type BusinessProfileScreenProps = {
  navigation: BusinessProfileNavigationProp;
  route: RouteProp<DrawerParamList, "BusinessProfile">;
};
export type UserProfileScreenProps = {
  navigation: UserProfileNavigationProp;
  route: RouteProp<DrawerParamList, "UserProfile">;
};
export type ServicesScreenProps = {
  navigation: ServicesNavigationProp;
  route: RouteProp<DrawerParamList, "Services">;
};
export type MarketingScreenProps = {
  navigation: MarketingNavigationProp;
  route: RouteProp<DrawerParamList, "Marketing">;
};
export type OnlineRezervationsScreenProps = {
  navigation: OnlineRezervationsNavigationProp;
  route: RouteProp<DrawerParamList, "OnlineRezervations">;
};
export type TeamScreenProps = {
  navigation: TeamNavigationProp;
  route: RouteProp<DrawerParamList, "Team">;
};
export type StatisticsScreenProps = {
  navigation: StatisticsNavigationProp;
  route: RouteProp<DrawerParamList, "Statistics">;
};
export type PaymentsAndBillingScreenProps = {
  navigation: PaymentsAndBillingNavigationProp;
  route: RouteProp<DrawerParamList, "PaymentsAndBilling">;
};
export type SupportScreenProps = {
  navigation: SupportNavigationProp;
  route: RouteProp<DrawerParamList, "Support">;
};

// Tab screen props
export type AppointmentsScreenProps = {
  navigation: AppointmentsNavigationProp;
  route: RouteProp<TabParamList, "Appointments">;
};
export type ClientsScreenProps = {
  navigation: ClientsNavigationProp;
  route: RouteProp<TabParamList, "Clients">;
};
export type CheckoutScreenProps = {
  navigation: CheckoutNavigationProp;
  route: RouteProp<TabParamList, "Checkout">;
};
