import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { parsePhoneNumberFromString as parsePhoneNumber } from "libphonenumber-js";
import { RecoveryConfirmationScreenNavigationProp } from "../../types/navigationTypes";
import Button from "../../components/button.component";
import Input from "../../components/input.component";
import Space from "../../components/spacer.component";
import { Text } from "../../components/text.component";
import { checkIfEmailExists, resetPassword } from "../../../api/auth";
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
  gap: ${(props) => props.theme.space.sm}px;
`;

const Title = styled.Text`
  ${(props) => props.theme.typography.h3};
`;

const TitleDescription = styled.Text`
  ${(props) => props.theme.typography.bodyMedium};
`;

const FormWrapper = styled(View)`
  flex: 1;
  justify-content: space-between;
`;

const InputWrapper = styled(View)`
  flex: 1;
  justify-content: center;
  margin-bottom: 32px;
  gap: ${(props) => props.theme.space.sm}px;
`;

const EmailInput = styled(Input)``;
const PhoneInput = styled(Input)``;

const InputSwitchButton = styled(Button)``;

const RegisterButton = styled(Button)``;

////////////  Styling end  ///////////////

interface VerificationCodeResponse {
  success: boolean;
  message?: string;
}

interface VerificationCodeRequest {
  email?: string;
  phone?: string;
}

const PassRecoveryScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<RecoveryConfirmationScreenNavigationProp>();
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [callingCode, setCallingCode] = useState<string>("371");
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [inputOption, setInputOption] = useState<string>("use_phone");
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [snackBarMessage, setSnackBarMessage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (inputOption === "use_email") {
      setEmail("");
      if (phone.trim() !== "") {
        setButtonDisabled(false);
      } else {
        setButtonDisabled(true);
        setPhoneError(undefined);
      }
    } else {
      setPhone("");
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (regex.test(email)) {
        setEmailError(undefined);
      }
      if (email.trim() !== "") {
        setButtonDisabled(false);
      } else {
        setButtonDisabled(true);
        setEmailError(undefined);
      }
    }
  }, [email, phone, inputOption]);

  const toggleInputOption = () => {
    setInputOption((prevOption) =>
      prevOption === "use_email" ? "use_phone" : "use_email"
    );
  };

  const validatePhone = (value: string) => {
    if (value.trim() === "") {
      return t("phone_required");
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
      return t("email_required");
    } else if (!regex.test(value)) {
      return t("invalid_email");
    }
    return undefined;
  };

  const obfuscateContactInfo = (email?: string, phone?: string) => {
    if (email) {
      const [name, domain] = email.split("@");
      const obfuscatedName =
        name.length > 3
          ? `${name.slice(0, 2)}***${name.slice(-1)}`
          : `${name[0]}***`;
      return `${obfuscatedName}@${domain}`;
    }
    if (phone) {
      const visibleDigits = 3;
      const obfuscatedPart = "*".repeat(phone.length - visibleDigits);
      const visiblePart = phone.slice(-visibleDigits);
      return `${obfuscatedPart}${visiblePart}`;
    }
  };

  const handleSubmit = async () => {
    if (inputOption === "use_phone") {
      const emailValidationError = validateEmail(email);
      setEmailError(emailValidationError);
      setPhoneError(undefined);

      if (!emailValidationError) {
        const emailExistsresult = await checkIfEmailExists(email);
        const emailExists = emailExistsresult as unknown as { exists: boolean };
        if (!emailExists.exists) {
          setEmailError(t("email_not_found"));
          return;
        }

        try {
          const result = await resetPassword(email);
          if (result.success) {
            setSnackBarMessage(
              t("password_reset_email_sent", {
                email: obfuscateContactInfo(email),
              })
            );
            setEmail("");
          } else {
            setEmailError(result.message || t("error_sending_reset_email"));
          }
        } catch (error) {
          console.error(t("error_sending_reset_email"), error);
          setEmailError(t("error_sending_reset_email"));
        }
      }
    } else {
      const phoneValidationError = validatePhone(phone);
      setPhoneError(phoneValidationError);
      setEmailError(undefined);

      if (!phoneValidationError) {
        try {
          console.log("The code has been sent to " + callingCode + phone);
          setPhone("");
        } catch (error) {
          console.log("Error sending verification code: ", error);
          setPhoneError(t("error_sending_code"));
        }
      }
    }
    setSnackBarMessage(undefined);
    return;
  };

  return (
    <Background>
      <SafeArea>
        <SnackbarMessage
          status={"success"}
          label="OK"
          duration={20000}
          visible={!!snackBarMessage}
          onPress={() => navigation.navigate("Login")}
        >
          {snackBarMessage}
        </SnackbarMessage>
        <ScreenContainer>
          <Header>
            <Text fontVariant="h3">{t("forgot_password_title")}</Text>
            <Text fontVariant="bodyMedium">
              {t("forgot_password_description")}
            </Text>
          </Header>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={40}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              automaticallyAdjustKeyboardInsets
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <FormWrapper>
                <InputWrapper>
                  <View>
                    {inputOption === "use_phone" ? (
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
                    ) : (
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
                    )}
                  </View>
                  <InputSwitchButton
                    label={t(inputOption)}
                    mode="text"
                    onPress={toggleInputOption}
                  />
                </InputWrapper>
                <View>
                  <RegisterButton
                    label={t("send_code")}
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={buttonDisabled}
                  />
                </View>
              </FormWrapper>
              <Space top={16} />
            </ScrollView>
          </KeyboardAvoidingView>
        </ScreenContainer>
      </SafeArea>
    </Background>
  );
};

export default PassRecoveryScreen;
