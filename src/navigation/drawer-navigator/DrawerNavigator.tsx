import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../../components/drawer-content.component";
import TabNavigator from "../tab-navigator/TabNavigator";
import { Dimensions } from "react-native";
import { useTheme } from "styled-components/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  DrawerParamList,
  HomeTabsNavigationProp,
} from "../../types/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import ServicesScreen from "../../screens/drawer-screens/services.screen";
import MarketingScreen from "../../screens/drawer-screens/marketing.screen";
import OnlineRezervationsScreen from "../../screens/drawer-screens/online-rezervations.screen";
import TeamScreen from "../../screens/drawer-screens/team.screen";
import StatisticsScreen from "../../screens/drawer-screens/statistics.screen";
import PaymentsAndBillingScreen from "../../screens/drawer-screens/payments-billing.screen";
import SupportScreen from "../../screens/drawer-screens/support.screen";
import BusinessProfileStack from "./BusinessProfileStack";

const Drawer = createDrawerNavigator<DrawerParamList>();
// const { width } = Dimensions.get("screen");

const DrawerNavigator = () => {
  const navigation = useNavigation<HomeTabsNavigationProp>();
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ route }) => ({
        drawerIcon: ({ size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          switch (route.name) {
            case "HomeTabs":
              iconName = `home${focused ? "" : "-outline"}`;
              break;
            case "Services":
              iconName = `list${focused ? "" : "-outline"}`;
              break;
            case "Marketing":
              iconName = `megaphone${focused ? "" : "-outline"}`;
              break;
            case "OnlineRezervations":
              iconName = `time${focused ? "" : "-outline"}`;
              break;
            case "Team":
              iconName = `people${focused ? "" : "-outline"}`;
              break;
            case "Statistics":
              iconName = `stats-chart${focused ? "" : "-outline"}`;
              break;
            case "PaymentsAndBilling":
              iconName = `receipt${focused ? "" : "-outline"}`;
              break;
            case "Support":
              iconName = `information-circle${focused ? "" : "-outline"}`;
              break;

            default:
              iconName = "home";
              break;
          }
          return (
            <Ionicons
              name={iconName}
              size={size}
              color={theme.colors.text}
              style={{ marginRight: -16 }}
            />
          );
        },
        drawerItemStyle: {
          marginHorizontal: 0,
        },
        drawerLabelStyle: {
          fontSize: theme.sizes.md,
        },
        headerShown: false,
        swipeEdgeWidth: 200,
        drawerActiveTintColor: theme.colors.text,
        drawerInactiveTintColor: theme.colors.text,
      })}
    >
      {/* {!isEmailVerified && <AccountVerificationBanner />} */}
      <Drawer.Screen
        name="BusinessProfileStack"
        component={BusinessProfileStack}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="HomeTabs"
        component={TabNavigator}
        options={{ title: t("drawer_item_title_home") }}
      />
      <Drawer.Screen
        name="Services"
        component={ServicesScreen}
        options={{ title: t("drawer_item_title_services") }}
      />
      <Drawer.Screen
        name="Marketing"
        component={MarketingScreen}
        options={{ title: t("drawer_item_title_marketing") }}
      />
      <Drawer.Screen
        name="OnlineRezervations"
        component={OnlineRezervationsScreen}
        options={{ title: t("drawer_item_title_online_rezervations") }}
      />
      <Drawer.Screen
        name="Team"
        component={TeamScreen}
        options={{ title: t("drawer_item_title_team") }}
      />
      <Drawer.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ title: t("drawer_item_title_statistics") }}
      />
      <Drawer.Screen
        name="PaymentsAndBilling"
        component={PaymentsAndBillingScreen}
        options={{ title: t("drawer_item_title_payment_billing") }}
      />
      <Drawer.Screen
        name="Support"
        component={SupportScreen}
        options={{
          title: t("drawer_item_title_support"),
          headerShown: true,
          headerLeft: () => (
            <Ionicons
              name="close"
              color={theme.colors.text}
              onPress={() => navigation.goBack()}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
