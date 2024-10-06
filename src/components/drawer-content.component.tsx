import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
  DrawerItemList,
} from "@react-navigation/drawer";
import styled, { useTheme } from "styled-components/native";
import ListItem from "./button/list-item.component";
import Button from "./button/button.component";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../context/useThemeContext";
import { UserContext } from "../context/UserProvider";
import { logoutUser } from "../services/authService";
import { BusinessContext } from "../context/BusinessProvider";
import { getUserData } from "../services/userService";
import { Icon } from "react-native-paper";

const SafeView = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const DrawerContainer = styled(View)`
  flex: 1;
  justify-content: space-between;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
  background-color: ${(props) => props.theme.colors.background};
`;

const DrawerFooter = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  padding-top: ${(props) => props.theme.space.md}px;
  padding-bottom: ${(props) => props.theme.space.md}px;
`;

interface UserData {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  userLogo?: string;
  firstLogin?: boolean;
}

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isDarkTheme, toggleTheme } = useThemeContext();
  const [userData, setUserData] = useState<UserData | null>(null);
  const userContext = useContext(UserContext);
  const businessContext = useContext(BusinessContext);
  if (!userContext || !businessContext) return;
  const { user } = userContext;
  const { businessData } = businessContext;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const userData = await getUserData();
      setUserData(userData);
    };
    fetchUserData();
  }, [user, userData]);

  return (
    <SafeView>
      <DrawerContainer>
        <ListItem
          {...props}
          title={`${businessData?.businessName}`}
          subtitle={`${businessData?.location?.address}, ${businessData?.location?.city}, ${businessData?.location?.postalCode}`}
          botLine={true}
          topLine={false}
          iconLeft={
            businessData?.businessLogo ? (
              <Image source={{ uri: businessData?.businessLogo }} />
            ) : (
              <Icon source="star" size={24} color="" />
            )
          }
        />
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
        <DrawerFooter>
          <Button
            mode="text"
            label={t("button_logout_text")}
            icon="logout"
            iconColor={theme.colors.secondary.dark}
            onPress={logoutUser}
          />
          <Button
            mode="text"
            label=""
            icon={`${isDarkTheme ? "weather-sunny" : "weather-night"}`}
            iconColor={theme.colors.secondary.dark}
            onPress={toggleTheme}
          />
        </DrawerFooter>
        <ListItem
          title={`${userData?.name} ${userData?.surname}`}
          subtitle="Profila iestatījumi"
          iconLeft={<Icon source="account" size={24} color="" />}
          botLine={false}
          topLine={true}
        />
      </DrawerContainer>
    </SafeView>
  );
};

export default CustomDrawerContent;
