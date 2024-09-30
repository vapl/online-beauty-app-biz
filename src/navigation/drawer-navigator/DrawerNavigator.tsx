import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SettingsScreen from "../../screens/tab-screens/settings.screen";
import CustomDrawerContent from "../../components/drawer-content.component";
import TabNavigator from "../tab-navigator/TabNavigator";
import { Dimensions } from "react-native";

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get("screen");

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEdgeWidth: 200,
      }}
    >
      <Drawer.Screen name="HomeTabs" component={TabNavigator} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
