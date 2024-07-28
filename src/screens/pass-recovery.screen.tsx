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
import { StackNavigationProp } from "@react-navigation/stack";

import { RecoveryConfirmationScreenNavigationProp } from "../types/navigationTypes";
import Button from "../components/button.component";
import Input from "../components/Input";
import Space from "../components/Spacer";

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

const PassRecoveryScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RecoveryConfirmationScreenNavigationProp>();
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [callingCode, setCallingCode] = useState<string>("371");
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [inputOption, setInputOption] = useState<string>("use_phone");
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

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
      return "phone_required";
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

  const handleSubmit = () => {
    if (inputOption === "use_phone") {
      const emailValidationError = validateEmail(email);
      setEmailError(emailValidationError);
      setPhoneError(undefined);

      if (!emailValidationError) {
        console.log("The code has been sent to " + email);
        navigation.navigate("RecoveryConfirmation", { email });
        setEmail("");
      }
    } else {
      const phoneValidationError = validatePhone(phone);
      setPhoneError(phoneValidationError);
      setEmailError(undefined);

      if (!phoneValidationError) {
        console.log("The code has been sent to " + callingCode + phone);
        navigation.navigate("RecoveryConfirmation", { phone });
        setPhone("");
      }
    }

    return;
  };

  return (
    <Background>
      <SafeArea>
        <ScreenContainer>
          <Header>
            <Title>{t("forgot_password_title")}</Title>
            <TitleDescription>
              {t("forgot_password_description")}
            </TitleDescription>
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
