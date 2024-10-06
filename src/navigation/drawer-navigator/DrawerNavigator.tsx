import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SettingsScreen from "../../screens/tab-screens/settings.screen";
import CustomDrawerContent from "../../components/drawer-content.component";
import TabNavigator from "../tab-navigator/TabNavigator";
import { Dimensions } from "react-native";
import { useTheme } from "styled-components/native";
import Ionicons from "@expo/vector-icons/FontAwesome";
import { DrawerParamList } from "../../types/navigationTypes";

const Drawer = createDrawerNavigator<DrawerParamList>();
const { width } = Dimensions.get("screen");

const DrawerNavigator = () => {
  const theme = useTheme();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ route }) => ({
        drawerIcon: ({ size, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          switch (route.name) {
            case "HomeTabs":
              iconName = "home";
              break;
            case "Settings":
              iconName = "cog";
              break;
            case "Services":
              iconName = "list";
              break;

            default:
              iconName = "home";
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        swipeEdgeWidth: 200,
      })}
    >
      {/* {!isEmailVerified && <AccountVerificationBanner />} */}
      <Drawer.Screen name="HomeTabs" component={TabNavigator} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen
        name="Services"
        component={SettingsScreen}
        options={{ headerShown: true }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
