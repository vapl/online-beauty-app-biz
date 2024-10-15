import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import {
  LoginScreenProps,
  BusinessProfileMainNavigationProp,
  LoginScreenNavigationProp,
} from "../../types/navigationTypes";
import styled, { useTheme } from "styled-components/native";
import Button from "../../components/button/button.component";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Input from "../../components/inputs/input.component";
import Text from "../../components/text.component";
import { loginUser, useGoogleSignIn } from "../../services/authService";
import { SnackbarMessage } from "../../components/snackbar.component";

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

const FormWrapper = styled(View)`
  flex: 1;
  justify-content: flex-end;
`;

const BodyWrapper = styled(View)`
  flex: 1;
  justify-content: center;
`;

const InputWrapper = styled(View)`
  padding-top: ${(props) => props.theme.space.md}px;
  justify-content: center;
  align-items: stretch;
  gap: ${(props) => props.theme.space.sm}px;
`;

const EmailInput = styled(Input)``;
const PasswordInput = styled(Input)``;

const LoginButton = styled(Button)``;
const RegisterButton = styled(Button)``;
const SocialButton = styled(Button)``;
const PassRecoverButton = styled(Button)``;

const DividerWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: ${(props) => props.theme.space.xl}px;
  margin: 16px 0 16px 0;
`;

const Divider = styled(View)`
  height: 1px;
  background-color: ${(props) => props.theme.colors.grey[40]};
  flex-grow: 1;
`;

const FooterContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${(props) => props.theme.space.lg}px;
  margin-bottom: ${(props) => props.theme.space.lg}px;
  gap: ${(props) => props.theme.space.sm}px;
`;

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const loginNavigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  );
  const [snackBarMessage, setSnackBarMessage] = useState<string | undefined>(
    undefined
  );

  const { promptAsync } = useGoogleSignIn();

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.trim() === "") {
      return t("email_required");
    } else if (!regex.test(value)) {
      return t("invalid_email");
    }
    return undefined;
  };

  const validatePassword = (value: string) => {
    if (value.trim() === "") {
      return "password_required";
    } else if (value.length < 6) {
      return "password_too_short";
    }
    return undefined;
  };

  const handleSubmit = async () => {
    setSnackBarMessage(undefined);
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    if (!emailValidationError && !passwordValidationError) {
      try {
        await loginUser(email, password);
      } catch (error: any) {
        console.error("Login failed: ", error.code);
        if (error.code === "auth/invalid-credential") {
          setSnackBarMessage(t("invalid_credential"));
        }
        if (error.code === "auth/too-many-requests") {
          setSnackBarMessage(t("too_many_requests"));
        }
      }
    }
  };

  return (
    <Background>
      <SafeArea>
        <SnackbarMessage
          status={"error"}
          label="OK"
          duration={5000}
          visible={!!snackBarMessage}
        >
          {snackBarMessage}
        </SnackbarMessage>
        <ScreenContainer>
          <Header>
            <Text fontVariant="h3">{t("login_welcome_title")}</Text>
            <Text fontVariant="bodyMedium">
              {t("login_welcome_description")}
            </Text>
          </Header>
          <FormWrapper>
            <BodyWrapper>
              <InputWrapper>
                <EmailInput
                  value={email}
                  onChangeText={setEmail}
                  label={t("email")}
                  iconLeft="email"
                  validate={validateEmail}
                  keyboardType="email-address"
                  textContentType="none"
                  errorMessage={emailError}
                  autoCorrect={false}
                  required
                  onSubmitEditing={() => handleSubmit()}
                  returnKeyType="next"
                />
                <PasswordInput
                  value={password}
                  onChangeText={setPassword}
                  label={t("password")}
                  iconLeft="lock"
                  validate={validatePassword}
                  secureTextEntry={true}
                  keyboardType="default"
                  textContentType="password"
                  errorMessage={passwordError}
                  autoCorrect={false}
                  required
                  onSubmitEditing={() => handleSubmit()}
                  returnKeyType="done"
                />
                <PassRecoverButton
                  label={t("password_recovery_button")}
                  mode="text"
                  onPress={() => loginNavigation.navigate("PassRecovery")}
                />
              </InputWrapper>
            </BodyWrapper>
            <View>
              <LoginButton
                label={t("login")}
                mode="contained"
                onPress={handleSubmit}
              />
              <DividerWrapper>
                <Divider />
                <Text fontVariant="bodyLarge">{t("or")}</Text>
                <Divider />
              </DividerWrapper>
              <SocialButton
                label={t("onboarding_button_join_google")}
                mode="outlined"
                icon="google"
                onPress={() => promptAsync()}
              />
            </View>
          </FormWrapper>
          <FooterContainer>
            <Text fontVariant="bodyMedium">{t("do_not_have_account")}</Text>
            <Button
              mode="text"
              label={t("register")}
              onPress={() => {
                loginNavigation.navigate("Register");
              }}
            />
          </FooterContainer>
        </ScreenContainer>
      </SafeArea>
    </Background>
  );
};

export default LoginScreen;
