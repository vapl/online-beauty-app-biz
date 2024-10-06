import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../../types/navigationTypes";
import AppointmentsScreen from "../../screens/tab-screens/appointments.screen";
import ClientsScreen from "../../screens/tab-screens/clients.screen";
import CheckoutScreen from "../../screens/tab-screens/checkout.screen";
import { Icon, IconButton } from "react-native-paper";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useDrawerStatus } from "@react-navigation/drawer";
import CustomDrawerIcon from "../../components/drawer-icon.component";
import { Image } from "react-native";
import { useTheme } from "styled-components/native";
import Ionicons from "@expo/vector-icons/FontAwesome";

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          switch (route.name) {
            case "Clients":
              iconName = "group";
              break;
            case "Appointments":
              iconName = "calendar";
              break;
            case "Checkout":
              iconName = "credit-card";
              break;
            default:
              iconName = "circle";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary.dark,
        headerLeft: () => (
          <CustomDrawerIcon
            type="image"
            size={30}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer)}
          />
        ),
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.grey[40],
        },
      })}
    >
      <Tab.Screen name="Clients" component={ClientsScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Checkout" component={CheckoutScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
