import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import {
  MainScreenNavigationProp,
  MainScreenProps,
} from "../../types/navigationTypes";
import styled, { useTheme } from "styled-components/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Text } from "../../components/text.component";
import Button from "../../components/button.component";
import { authStateListener, logoutUser } from "../../../api/auth";
import { HelperText } from "react-native-paper";

const SafeArea = styled(SafeAreaView)`
  flex: 1;
  margin-top: ${StatusBar.currentHeight}px;
`;

const Background = styled(View)`
  background-color: ${(props) => props.theme.colors.white};
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

const MainScreen: React.FC<MainScreenProps> = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<MainScreenNavigationProp>();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const unsubcribe = authStateListener((user) => {
      if (user) {
        if (!user.emailVerified) {
          setMessage("Please verify your email to access all features.");
        }
      } else {
        navigation.navigate("Login");
      }
    });
    return () => unsubcribe();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  return (
    <Background>
      <SafeArea>
        <HelperText type="error" visible={true}>
          {message}
        </HelperText>
        <ScreenContainer>
          <Header>
            <Text fontVariant="h3">MAIN SCREEN</Text>
            <Button label={"logout"} mode="text" onPress={handleLogout} />
          </Header>
        </ScreenContainer>
      </SafeArea>
    </Background>
  );
};

export default MainScreen;
