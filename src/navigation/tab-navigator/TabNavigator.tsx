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

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Appointments":
              iconName = "calendar-month";
              break;
            case "Clients":
              iconName = "account-group";
              break;
            case "Checkout":
              iconName = "credit-card-outline";
              break;
            default:
              iconName = "circle";
          }
          return <Icon source={iconName} size={size} color={color} />;
        },
        headerLeft: () => (
          <CustomDrawerIcon
            type="image"
            size={30}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer)}
          />
        ),
        headerStyle: {
          backgroundColor: "transparent",
          elevation: 0,
          shadowOpacity: 0,
        },
      })}
    >
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Clients" component={ClientsScreen} />
      <Tab.Screen name="Checkout" component={CheckoutScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
