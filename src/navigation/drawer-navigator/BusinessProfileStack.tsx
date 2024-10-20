import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  BusinessProfileParamList,
  HomeTabsNavigationProp,
} from "../../types/navigationTypes";
import BusinessProfileMainScreen from "../../screens/business-profile-screens/business-profile-main.screen";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import Button from "../../components/button/button.component";
import BusinessInfoScreen from "../../screens/business-profile-screens/business-info.screen";
import BusinessLocationsScreen from "../../screens/business-profile-screens/business-locations.screen";
import BusinessPortfolioScreen from "../../screens/business-profile-screens/business-portfolio.screen";
import { useRef, useState } from "react";
import { Animated } from "react-native";
import { BusinessContext } from "../../context/BusinessProvider";
import { useThemeContext } from "../../context/useThemeContext";
import BusinessProfileStatusScreen from "../../screens/business-profile-screens/business-profile-status.screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import Text from "../../components/text.component";
import { useTranslation } from "react-i18next";

const Stack = createNativeStackNavigator<BusinessProfileParamList>();

const BusinessProfileStack: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<HomeTabsNavigationProp>();

  const [headerShown, setHeaderShown] = useState<boolean>(false);
  const { isDarkTheme } = useThemeContext();

  const businessContext = useContext(BusinessContext);
  if (!businessContext) return;

  const { businessData } = businessContext;

  const handleScrollChange = (showHeader: boolean) => {
    setHeaderShown(showHeader);
  };

  return (
    <Stack.Navigator
      initialRouteName="BusinessProfileMain"
      screenOptions={{
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name="BusinessProfileMain"
        options={{
          headerTransparent: true,
          headerBlurEffect: headerShown
            ? isDarkTheme
              ? "dark"
              : "regular"
            : undefined,
          title: headerShown ? businessData?.businessName : "",
          headerTintColor: theme.colors.text,
          headerShadowVisible: true,
          headerLeft: () => (
            <Button
              mode={"icon"}
              iconName="close"
              iconColor={headerShown ? theme.colors.text : "#FFFFFF"}
              onPress={() => navigation.navigate("HomeTabs")}
            />
          ),
          headerRight: () => (
            <Button
              mode={"icon"}
              iconName="ellipsis-vertical"
              iconColor={headerShown ? theme.colors.text : "#FFFFFF"}
              onPress={() => {}}
            />
          ),
        }}
      >
        {(props) => (
          <BusinessProfileMainScreen
            {...props}
            onScrollChange={handleScrollChange}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="BusinessInfo"
        component={BusinessInfoScreen}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="BusinessProfileStatus"
        component={BusinessProfileStatusScreen}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTransparent: false,
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="BusinessLocations"
        component={BusinessLocationsScreen}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="BusinessPortfolio"
        component={BusinessPortfolioScreen}
        options={{
          title: "",
        }}
      />
    </Stack.Navigator>
  );
};

export default BusinessProfileStack;
