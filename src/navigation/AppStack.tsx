import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AppStackParamList } from "../types/navigationTypes";
import { useTheme } from "styled-components/native";
import MainScreen from "../screens/main-screens/main.screen";

const Stack = createStackNavigator<AppStackParamList>();

const AppStack: React.FC = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleAlign: "center",
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
