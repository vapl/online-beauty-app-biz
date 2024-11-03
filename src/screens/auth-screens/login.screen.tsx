import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  LoginScreenProps,
  LoginScreenNavigationProp,
} from "../../types/navigationTypes";
import { useTheme } from "styled-components/native";
import Button from "../../components/button/button.component";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Input from "../../components/inputs/input.component";
import Text from "../../components/text.component";
import { useGoogleSignIn } from "../../services/authService";
import { SnackbarMessage } from "../../components/snackbar.component";
import { isEmpty, isValidEmail } from "../../utils/validationUtils";
import { BackgroundColor } from "../../components/background-color.component";
import { SafeArea } from "../../components/safe-area.component";
import {
  BodyWrapper,
  Divider,
  DividerWrapper,
  FooterContainer,
  FormWrapper,
  Header,
  InputWrapper,
  ScreenContainer,
} from "./styles/login.styles";
import { loginUser } from "../../services/auth/loginUser";

const LoginScreen: React.FC<LoginScreenProps> = () => {
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

  const handleEmailChange = (text: string) => {
    setEmail(text);

    const isEmailEmpty = isEmpty(text, t("email_required"));
    const emailValidationError = isValidEmail(text, t("invalid_email"));

    let error = "";

    if (isEmailEmpty) error = isEmailEmpty;
    if (emailValidationError) error = emailValidationError;

    setEmailError(error);
    return error;
  };

  const handleSubmit = async () => {
    setSnackBarMessage(undefined);
    const emailValidationError = handleEmailChange(email);
    const passwordValidationError = isEmpty(password, t("password_required"));

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
    <BackgroundColor>
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
                <Input
                  value={email}
                  onChangeText={handleEmailChange}
                  label={t("email")}
                  iconLeft="email"
                  validate={isEmpty}
                  keyboardType="email-address"
                  textContentType="none"
                  errorMessage={emailError}
                  autoCorrect={false}
                  required
                  onSubmitEditing={() => handleSubmit()}
                  returnKeyType="next"
                />
                <Input
                  value={password}
                  onChangeText={setPassword}
                  label={t("password")}
                  iconLeft="lock"
                  validate={isEmpty}
                  secureTextEntry={true}
                  keyboardType="default"
                  textContentType="password"
                  errorMessage={passwordError}
                  autoCorrect={false}
                  required
                  onSubmitEditing={() => handleSubmit()}
                  returnKeyType="done"
                />
                <Button
                  label={t("password_recovery_button")}
                  mode="text"
                  onPress={() => loginNavigation.navigate("PassRecovery")}
                />
              </InputWrapper>
            </BodyWrapper>
            <View>
              <Button
                label={t("login")}
                mode="contained"
                onPress={handleSubmit}
              />
              <DividerWrapper>
                <Divider />
                <Text fontVariant="bodyLarge">{t("or")}</Text>
                <Divider />
              </DividerWrapper>
              <Button
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
    </BackgroundColor>
  );
};

export default LoginScreen;
