import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import {
  RegisterScreenNavigationProp,
  RegisterScreenProps,
} from "../../types/navigationTypes";
import Button from "../../components/button/button.component";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import Text from "../../components/text.component";
import { useTheme } from "styled-components/native";
import { registerUser } from "../../services/auth/registerUser";
import { SnackbarMessage } from "../../components/snackbar.component";
import {
  ScreenContainer,
  Header,
  FormWrapper,
  InputWrapper,
  RegulationsWrapper,
  ButtonsWrapper,
  Divider,
  DividerContent,
  FooterContainer,
  DividerWrapper,
} from "./styles/register.styles";
import {
  isEmpty,
  isValidEmail,
  isValidPassword,
} from "../../utils/validationUtils";
import LoadingSpinner from "../../components/loading-spinner.component";
import { BackgroundColor } from "../../components/background-color.component";
import { SafeArea } from "../../components/safe-area.component";
import Input from "../../components/inputs/input.component";
import { loginUser } from "../../services/auth/loginUser";

const RegisterScreen: React.FC<RegisterScreenProps> = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [surnameError, setSurnameError] = useState<string | undefined>(
    undefined
  );
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  );
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const [snackBarStatus, setSnackBarStatus] = useState<
    "success" | "error" | "warning"
  >("warning");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleNameChange = (text: string) => {
    setName(text);

    const nameValidationError = isEmpty(text, t("name_required"));
    if (name.trim().length < 2) {
      setNameError(nameValidationError);
      return nameValidationError;
    }
  };
  const handleSurnameChange = (text: string) => {
    setSurname(text);

    const surnameValidationError = isEmpty(text, t("surname_required"));
    if (surname.trim().length < 2) {
      setSurnameError(surnameValidationError);
      return surnameValidationError;
    }
  };

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

  const handlePasswordChange = (text: string) => {
    setPassword(text);

    const passwordEmptyError = isEmpty(text, t("password_required"));
    const passwordRegexError = isValidPassword(
      text,
      t("password_regex_pattern")
    );

    let error = "";

    if (passwordEmptyError) error = passwordEmptyError;
    if (passwordRegexError) error = passwordRegexError;

    setPasswordError(error);
    return error;
  };

  const handleSubmit = async () => {
    setSnackBarMessage("");

    // Validate data before state
    const currentNameerror = handleNameChange(name);
    const currentSurnameError = handleSurnameChange(surname);
    const currentEmailerror = handleEmailChange(email);
    const currentPasswordError = handlePasswordChange(password);

    if (
      !currentNameerror &&
      !currentSurnameError &&
      !currentEmailerror &&
      !currentPasswordError
    ) {
      // Register functionality with firebase
      try {
        setIsLoading(true);

        const loginNewUser = await registerUser(
          {
            email,
            name,
            surname,
          },
          password
        );
        setIsLoading(false);

        if (loginNewUser) {
          setSnackBarMessage(t("successfull_registration_message"));
          setSnackBarStatus("success");
          setTimeout(() => {
            loginUser(email, password);
          }, 5000);
        }
      } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
          setIsLoading(false);
          setSnackBarStatus("error");
          setSnackBarMessage(t("register_error_message"));
          return;
        }
      }
      setName("");
      setSurname("");
      setEmail("");
      setPassword("");
      setTimeout(() => {
        setSnackBarMessage("");
      }, 5000);
    }
    return;
  };

  return (
    <BackgroundColor>
      <LoadingSpinner isLoading={isLoading} />
      <SafeArea>
        <SnackbarMessage
          status={snackBarStatus}
          label={snackBarStatus === "error" ? t("login") : "OK"}
          duration={7000}
          visible={!!snackBarMessage}
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          {snackBarMessage}
        </SnackbarMessage>
        <ScreenContainer>
          <Header>
            <Text fontVariant="h3">{t("register_welcome_title")}</Text>
            <Text fontVariant="bodyMedium">
              {t("register_welcome_description")}
            </Text>
          </Header>
          <FormWrapper>
            <ScrollView
              automaticallyAdjustKeyboardInsets
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <KeyboardAvoidingView contentContainerStyle={{ flexGrow: 1 }}>
                <InputWrapper>
                  <Input
                    value={name}
                    onChangeText={handleNameChange}
                    validate={isEmpty}
                    autoCapitalize="sentences"
                    label={t("name_input")}
                    iconLeft="account"
                    textContentType="givenName"
                    autoCorrect={false}
                    errorMessage={nameError}
                    required
                  />
                  <Input
                    value={surname}
                    onChangeText={handleSurnameChange}
                    validate={isEmpty}
                    autoCapitalize="sentences"
                    label={t("surname_input")}
                    iconLeft="account"
                    textContentType="familyName"
                    errorMessage={surnameError}
                    required
                  />
                  <Input
                    value={email}
                    onChangeText={handleEmailChange}
                    label={t("email")}
                    iconLeft="email"
                    validate={isEmpty}
                    keyboardType="email-address"
                    errorMessage={emailError}
                    textContentType="none"
                    required
                  />
                  <Input
                    value={password}
                    onChangeText={handlePasswordChange}
                    validate={isEmpty}
                    label={t("password")}
                    iconLeft="lock"
                    iconRight="eye"
                    secureTextEntry={true}
                    errorMessage={passwordError}
                    required
                  />
                  <RegulationsWrapper>
                    <Text fontVariant="bodyMedium">
                      {t("register_terms_start")}
                    </Text>
                    <Text
                      fontVariant="buttonMedium"
                      textColor={theme.colors.secondary.dark}
                      onPress={() => {}}
                    >
                      {` ${t("terms_of_use")} `}
                    </Text>
                    <Text>{t("and")}</Text>
                    <Text
                      fontVariant="buttonMedium"
                      textColor={theme.colors.secondary.dark}
                      onPress={() => {}}
                    >
                      {` ${t("privacy_policy")} `}
                    </Text>
                  </RegulationsWrapper>
                </InputWrapper>
              </KeyboardAvoidingView>
            </ScrollView>
            <ButtonsWrapper>
              <Button
                label={t("register")}
                mode="contained"
                onPress={handleSubmit}
              />
              <DividerWrapper>
                <Divider />
                <DividerContent>{t("or")}</DividerContent>
                <Divider />
              </DividerWrapper>
              <Button
                label={t("onboarding_button_join_google")}
                mode="outlined"
                icon="google"
                onPress={() => {}}
              />
            </ButtonsWrapper>
          </FormWrapper>
          <FooterContainer>
            <Text fontVariant="bodyMedium">{t("already_have_account")}</Text>
            <Button
              mode="text"
              label={t("login")}
              onPress={() => {
                navigation.navigate("Login");
              }}
            />
          </FooterContainer>
        </ScreenContainer>
      </SafeArea>
    </BackgroundColor>
  );
};

export default RegisterScreen;
