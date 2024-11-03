import React, { useContext, useEffect, useState } from "react";
import { View, SafeAreaView, Image } from "react-native";
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerItemList,
} from "@react-navigation/drawer";
import styled, { useTheme } from "styled-components/native";
import ListItem from "./button/list-item.component";
import Button from "./button/button.component";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../context/useThemeContext";
import { UserContext } from "../context/UserProvider";
import { BusinessContext } from "../context/BusinessProvider";
import { getUserData } from "../services/user/userService";
import { Icon } from "react-native-paper";
import LanguagePicker from "./language-picker.component";
import { useNavigation } from "@react-navigation/native";
import { BusinessProfileStackNavigationProp } from "../types/navigationTypes";
import { logoutUser } from "../services/auth/loginUser";

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
  isFirstLogin?: boolean;
}

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const businessNavigation =
    useNavigation<BusinessProfileStackNavigationProp>();
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
      const userData = await getUserData(user.uid);
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
          subtitle={`${businessData?.legalAddress}, ${businessData?.legalAddress?.city}, ${businessData?.legalAddress?.postalCode}`}
          botLine={true}
          topLine={false}
          iconLeft={
            businessData?.images?.businessLogo ? (
              <Image
                source={{ uri: businessData?.images.businessLogo }}
                style={{ height: 48, width: 48, borderRadius: 24 }}
              />
            ) : (
              <Icon source="star" size={24} color="" />
            )
          }
          onPress={() => businessNavigation.navigate("BusinessProfileStack")}
        />
        <LanguagePicker color={theme.colors.text} />
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
        <DrawerFooter>
          <Button
            mode="text"
            label={t("button_logout_text")}
            icon="logout"
            iconColor={theme.colors.secondary.dark}
            onPress={() => {
              logoutUser();
            }}
          />
          <Button
            mode="icon"
            iconName={`${isDarkTheme ? "sunny-outline" : "moon-outline"}`}
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
