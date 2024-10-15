import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  BusinessProfileParamList,
  HomeTabsNavigationProp,
} from "../../types/navigationTypes";
import BusinessProfileMainScreen from "../../screens/business-profile-screens/business-profile-main.screen";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import Button from "../../components/button/button.component";
import BusinessInfoScreen from "../../screens/business-profile-screens/business-info.screen";
import BusinessLocations from "../../screens/business-profile-screens/business-locations.screen";

const Stack = createStackNavigator<BusinessProfileParamList>();

const BusinessProfileStack: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<HomeTabsNavigationProp>();
  return (
    <Stack.Navigator
      initialRouteName="BusinessProfileMain"
      screenOptions={{
        headerLeftContainerStyle: { paddingLeft: theme.space.md },
        headerRightContainerStyle: { paddingRight: theme.space.md },
      }}
    >
      <Stack.Screen
        name="BusinessProfileMain"
        component={BusinessProfileMainScreen}
        options={{
          headerTransparent: true,
          headerStyle: { backgroundColor: "transparent" },
          title: "",
          headerLeft: () => (
            <Button
              mode={"icon"}
              iconName="close"
              iconColor={theme.colors.white}
              onPress={() => navigation.navigate("HomeTabs")}
            />
          ),
          headerRight: () => (
            <Button
              mode={"icon"}
              iconName="ellipsis-vertical"
              iconColor={theme.colors.white}
              onPress={() => {}}
            />
          ),
        }}
      />
      <Stack.Screen
        name="BusinessInfo"
        component={BusinessInfoScreen}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="BusinessLocations"
        component={BusinessLocations}
        options={{
          title: "",
        }}
      />
    </Stack.Navigator>
  );
};

export default BusinessProfileStack;
