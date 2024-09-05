import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import {
  AppStackNavigationProp,
  MainScreenProps,
} from "../../types/navigationTypes";
import styled, { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Text } from "../../components/text.component";
import Button from "../../components/button/button.component";
import { authStateListener, logoutUser } from "../../services/authService";
import { sendVerificationEmail } from "../../services/authService";
import { User } from "firebase/auth";
import { getUserData } from "../../services/userService";
import { firestore } from "../../api/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { UserContext } from "../../context/UserProvider";
import { SnackbarMessage } from "../../components/snackbar.component";
import { handleError } from "../../utils/errorHandler";

const SafeArea = styled(SafeAreaView)`
  flex: 1;
  margin-top: ${StatusBar.currentHeight}px;
`;

const Background = styled(View)`
  background-color: ${(props) => props.theme.colors.background};
  flex: 1;
`;

const ScreenContainer = styled(View)`
  flex: 1;
  justify-content: space-between;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
`;

const Header = styled(View)`
  justify-content: flex-start;
  padding-top: ${(props) => props.theme.space.xxl}px;
  gap: ${(props) => props.theme.space.sm}px;
`;

interface UserData {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  firstLogin?: boolean;
}

const MainScreen: React.FC<MainScreenProps> = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const theme = useTheme();
  const navigation = useNavigation<AppStackNavigationProp>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const userContext = useContext(UserContext);
  if (!userContext) return;
  const { user, isEmailVerified, firstLogin } = userContext;

  const fetchUserData = async () => {
    const userData = await getUserData();
    setUserData(userData);
  };

  useEffect(() => {
    fetchUserData();
  }, [user, userData]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigation.navigate("Login");
    } catch (error) {
      handleError(error, "Logout error: ");
    }
  };

  const handleResendVerification = async () => {
    if (user) {
      try {
        await sendVerificationEmail(user, language);
        setSnackBarMessage(
          "The verification link has been sent to your email."
        );
      } catch (error) {
        handleError(error, "Failed to send verification email");
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    await user?.reload();
    console.log("first login: ", userData?.firstLogin);
    setRefreshing(false);
  };

  return (
    <SafeArea>
      <SnackbarMessage
        status={"warning"}
        label="OK"
        duration={5000}
        visible={!!snackBarMessage}
      >
        {snackBarMessage}
      </SnackbarMessage>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Background>
          <ScreenContainer>
            <Header>
              <Text fontVariant="h3">MAIN SCREEN</Text>
              <Text fontVariant="bodyMedium">Hi, {userData?.name}</Text>
              <Text fontVariant="bodyMedium">{userData?.email}</Text>
              <Button label={"logout"} mode="text" onPress={handleLogout} />
              {!isEmailVerified && (
                <Button
                  label={"Send verification link"}
                  mode="text"
                  onPress={handleResendVerification}
                />
              )}
            </Header>
          </ScreenContainer>
        </Background>
      </ScrollView>
    </SafeArea>
  );
};

export default MainScreen;
