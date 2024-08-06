import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigationTypes";
import MainScreen from "../screens/main-screens/main.screen";
import AccountSetupBusinessNameScreen from "../screens/account-setup-screens/account-setup-business-name.screen";
// import AccountSetupServicesScreen from "../screens/account-setup-services.screen";
// import AccountSetupTeamScreen from "../screens/account-setup-team.screen";
// import AccountSetupLocationScreen from "../screens/account-setup-location.screen";

const Stack = createStackNavigator<RootStackParamList>();

const AppStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="AccountSetupBusinessName"
        component={AccountSetupBusinessNameScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="AccountSetupServices"
        component={AccountSetupServicesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AccountSetupTeam"
        component={AccountSetupTeamScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AccountSetupLocation"
        component={AccountSetupLocationScreen}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
};

export default AppStack;
