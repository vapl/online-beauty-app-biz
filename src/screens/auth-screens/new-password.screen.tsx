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
import {
  NewPasswordScreenNavigationProp,
  NewPasswordScreenProps,
} from "../../types/navigationTypes";
import Button from "../../components/button/button.component";
import Input from "../../components/inputs/input.component";
import Space from "../../components/spacer.component";
import Text from "../../components/text.component";

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

const FormWrapper = styled(View)`
  flex: 1;
  justify-content: space-between;
`;

const InputWrapper = styled(View)`
  flex: 1;
  justify-content: center;
  margin-bottom: 32px;
`;

const InputWrapperChild = styled(View)`
  gap: ${(props) => props.theme.space.md}px;
`;

const NewPasswordConfirmation = styled(Input)``;
const NewPasswordConfirmationInput = styled(Input)``;

const RegisterButton = styled(Button)``;

////////////  Styling end  ///////////////

const NewPasswordScreen: React.FC<NewPasswordScreenProps> = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NewPasswordScreenNavigationProp>();
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | undefined>(
    undefined
  );
  const [ConfirmationPasswordErrorMsg, setConfirmationPasswordErrorMsg] =
    useState<string | undefined>(undefined);

  const validatePassword = (value: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (value.trim() === "") {
      return t("password_required");
    } else if (value.length < 8 || !regex.test(value)) {
      return t("password_regex_pattern");
    }
    return undefined;
  };

  const validateConfirmationPassword = (value: string) => {
    return password.trim() !== value.trim()
      ? t("passwords_dont_match")
      : undefined;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordErrorMsg(validatePassword(value));
  };

  const handlePasswordConfirmationChange = (value: string) => {
    setPasswordConfirmation(value);
    setConfirmationPasswordErrorMsg(validateConfirmationPassword(value));
  };

  const handleSubmit = () => {
    const passwordError = validatePassword(password);
    const passwordConfirmError =
      validateConfirmationPassword(passwordConfirmation);

    setPasswordErrorMsg(passwordError);
    setConfirmationPasswordErrorMsg(passwordConfirmError);
    if (!passwordError && !passwordConfirmError) {
      setPassword("");
      setPasswordConfirmation("");
    }
  };

  return (
    <Background>
      <SafeArea>
        <ScreenContainer>
          <Header>
            <Text fontVariant="h3">{t("new_password_title")}</Text>
            <Text fontVariant="bodyMedium">
              {t("new_password_description")}
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
                  <InputWrapperChild>
                    <NewPasswordConfirmation
                      value={password}
                      onChangeText={handlePasswordChange}
                      label={t("new_password")}
                      iconLeft="lock"
                      iconRight="eye"
                      validate={validatePassword}
                      keyboardType="default"
                      secureTextEntry={true}
                      autoCorrect={false}
                      errorMessage={passwordErrorMsg}
                      textContentType="password"
                      required
                    />
                    <NewPasswordConfirmationInput
                      value={passwordConfirmation}
                      onChangeText={handlePasswordConfirmationChange}
                      validate={validateConfirmationPassword}
                      label={t("new_password_confirmation")}
                      iconLeft="lock"
                      iconRight="eye"
                      keyboardType="default"
                      secureTextEntry={true}
                      autoCorrect={false}
                      errorMessage={ConfirmationPasswordErrorMsg}
                      textContentType="password"
                      onFocus={() =>
                        setPasswordErrorMsg(validatePassword(password))
                      }
                      required
                    />
                  </InputWrapperChild>
                </InputWrapper>
                <View>
                  <RegisterButton
                    label={t("confirm_new_password")}
                    mode="contained"
                    onPress={handleSubmit}
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

export default NewPasswordScreen;
