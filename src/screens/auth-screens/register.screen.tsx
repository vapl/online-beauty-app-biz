import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import {
  RegisterScreenNavigationProp,
  RegisterScreenProps,
} from "../../types/navigationTypes";
import styled from "styled-components/native";
import Button from "../../components/button/button.component";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Input from "../../components/inputs/input.component";
import { parsePhoneNumber } from "libphonenumber-js";
import Text from "../../components/text.component";
import { useTheme } from "styled-components/native";
import { registerUser } from "../../services/authService";
import { SnackbarMessage } from "../../components/snackbar.component";

//////////// Styling start ///////////////

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
  padding-bottom: ${(props) => props.theme.space.md}px;
  gap: ${(props) => props.theme.space.xs}px;
`;

const FormWrapper = styled(View)`
  flex: 1;
  justify-content: space-between;
`;

const InputWrapper = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: stretch;
  gap: ${(props) => props.theme.space.sm}px;
`;

const NameInput = styled(Input)``;
const SurnameInput = styled(Input)``;
const EmailInput = styled(Input)``;
const PhoneInput = styled(Input)``;
const PasswordInput = styled(Input)``;

const RegisterButton = styled(Button)``;
const SocialButton = styled(Button)``;

const RegulationsWrapper = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  padding: ${(props) => props.theme.space.sm}px 0
    ${(props) => props.theme.space.sm}px 0;
`;

const ButtonsWrapper = styled(View)`
  padding-top: ${(props) => props.theme.space.md}px;
`;

const DividerWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: ${(props) => props.theme.space.xl}px;
  margin: ${(props) => props.theme.space.md}px 0
    ${(props) => props.theme.space.md}px 0;
`;

const Divider = styled(View)`
  height: 1px;
  background-color: ${(props) => props.theme.colors.grey[40]};
  flex-grow: 1;
`;

const DividerContent = styled.Text`
  ${(props) => props.theme.typography.bodyLarge};
`;

const FooterContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${(props) => props.theme.space.lg}px;
  margin-bottom: ${(props) => props.theme.space.lg}px;
  gap: ${(props) => props.theme.space.sm}px;
`;

////////////  Styling end  ///////////////

const RegisterScreen: React.FC<RegisterScreenProps> = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [callingCode, setCallingCode] = useState<string>("371");
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  const [surnameError, setSurnameError] = useState<string | undefined>(
    undefined
  );
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  );
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");

  useEffect(() => {
    callingCode;
  }, []);

  const validateName = (value: string) => {
    if (value.trim() === "") {
      return "*" + t("name_required");
    }
    return undefined;
  };

  const validateSurname = (value: string) => {
    if (value.trim() === "") {
      return "*" + t("surname_required");
    }
    return undefined;
  };

  const validatePhone = (value: string) => {
    if (value.trim() === "") {
      return "*" + t("phone_required");
    }

    const phoneNumber = parsePhoneNumber(value, {
      defaultCallingCode: callingCode,
    });
    if (phoneNumber && phoneNumber?.isValid()) {
      return undefined;
    } else {
      return t("invalid_phone");
    }
  };

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.trim() === "") {
      return "*" + t("email_required");
    } else if (!regex.test(value)) {
      return t("invalid_email");
    }
    return undefined;
  };

  const validatePassword = (value: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (value.trim() === "") {
      return "*" + t("password_required");
    } else if (value.length < 8 || !regex.test(value)) {
      return t("password_regex_pattern");
    }
    return undefined;
  };

  const handleSubmit = async () => {
    const nameValidationError = validateName(name);
    const surnameValidationError = validateSurname(surname);
    const emailValidationError = validateEmail(email);
    const phoneValidationError = validatePhone(phone);
    const passwordValidationError = validatePassword(password);

    setNameError(nameValidationError);
    setSurnameError(surnameValidationError);
    setEmailError(emailValidationError);
    setPhoneError(phoneValidationError);
    setPasswordError(passwordValidationError);

    if (
      !emailValidationError &&
      !passwordValidationError &&
      !nameValidationError &&
      !surnameValidationError &&
      !phoneValidationError
    ) {
      // Register functionality with firebase
      try {
        await registerUser({
          email,
          password,
          name,
          surname,
          phone: callingCode + phone,
        });

        setSnackBarMessage(t("successfull_registration_message"));

        setName("");
        setSurname("");
        setEmail("");
        setPhone("");
        setPassword("");
        setTimeout(() => {
          setSnackBarMessage("");
        }, 5000);
      } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
          setEmailError(t("email_already_in_use"));
          return;
        }
      }
    }
    return;
  };

  return (
    <Background>
      <SafeArea>
        <SnackbarMessage
          status={"success"}
          label="OK"
          duration={5000}
          visible={!!snackBarMessage}
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
                  <NameInput
                    value={name}
                    onChangeText={setName}
                    validate={validateName}
                    autoCapitalize="sentences"
                    label={t("name_input")}
                    iconLeft="account"
                    textContentType="givenName"
                    autoCorrect={false}
                    errorMessage={nameError}
                    required
                  />
                  <SurnameInput
                    value={surname}
                    onChangeText={setSurname}
                    validate={validateSurname}
                    autoCapitalize="sentences"
                    label={t("surname_input")}
                    iconLeft="account"
                    textContentType="familyName"
                    errorMessage={surnameError}
                    required
                  />
                  <EmailInput
                    value={email}
                    onChangeText={setEmail}
                    label={t("email")}
                    iconLeft="email"
                    validate={validateEmail}
                    keyboardType="email-address"
                    errorMessage={emailError}
                    textContentType="none"
                    required
                  />
                  <PhoneInput
                    value={phone}
                    onChangeText={setPhone}
                    validate={validatePhone}
                    label={t("phone_input")}
                    iconLeft="phone"
                    keyboardType="phone-pad"
                    countryCodePicker={true}
                    errorMessage={phoneError}
                    required
                    setCallingCode={setCallingCode}
                  />
                  <PasswordInput
                    value={password}
                    onChangeText={setPassword}
                    label={t("password")}
                    iconLeft="lock"
                    iconRight="eye"
                    validate={validatePassword}
                    secureTextEntry={true}
                    errorMessage={passwordError}
                    required
                  />
                  <RegulationsWrapper>
                    <Text fontVariant="bodyMedium">
                      {t("register_terms_start")}{" "}
                      <Text
                        fontVariant="buttonMedium"
                        textColor={theme.colors.secondary.dark}
                        onPress={() => {}}
                      >
                        {t("terms_of_use")}{" "}
                      </Text>
                      <Text>{t("and")}</Text>{" "}
                      <Text
                        fontVariant="buttonMedium"
                        textColor={theme.colors.secondary.dark}
                        onPress={() => {}}
                      >
                        {t("privacy_policy")}
                      </Text>
                    </Text>
                  </RegulationsWrapper>
                </InputWrapper>
              </KeyboardAvoidingView>
            </ScrollView>
            <ButtonsWrapper>
              <RegisterButton
                label={t("register")}
                mode="contained"
                onPress={handleSubmit}
              />
              <DividerWrapper>
                <Divider />
                <DividerContent>{t("or")}</DividerContent>
                <Divider />
              </DividerWrapper>
              <SocialButton
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
    </Background>
  );
};

export default RegisterScreen;
