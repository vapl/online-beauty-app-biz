import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  AppStackParamList,
  HomeTabsNavigationProp,
} from "../types/navigationTypes";
import { useTheme } from "styled-components/native";
import MainScreen from "../screens/main-screens/main.screen";
import Ionicons from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator<AppStackParamList>();

const AppStack: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<HomeTabsNavigationProp>();

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
          headerShown: true, // Galvene tiek rādīta
          headerLeft: () => (
            <Ionicons
              name="close"
              size={24}
              color={theme.colors.text}
              onPress={() => navigation.goBack()} // Manuāla atgriešanās funkcija
              style={{ marginLeft: 16 }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
