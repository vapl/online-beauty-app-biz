import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput as RNTextInput,
} from "react-native";
import {
  RecoveryConfirmationScreenNavigationProp,
  RecoveryConfirmationScreenProps,
  RootStackParamList,
} from "../../types/navigationTypes";
import styled, { useTheme } from "styled-components/native";
import Button from "../../components/button/button.component";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { HelperText, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Space from "../../components/spacer.component";
import * as Clipboard from "expo-clipboard";
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

const HelpTextWrapper = styled(View)`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: space;
`;

const InfoText = styled(HelperText)`
  ${(props) => props.theme.typography.bodyMedium};
  color: ${(props) => props.theme.colors.status.error};
`;

const InputBody = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 32px;
  gap: 16px;
`;

const InputWrapper = styled(View)`
  justify-content: center;
  flex-direction: row;
  gap: 16px;
`;

interface CodeInputProps {
  hasError?: boolean;
}

const CodeInput = styled(TextInput).attrs<CodeInputProps>((props) => ({
  mode: "outlined",
  selectionColor: props.theme.colors.primary.dark,
  cursorColor: props.theme.colors.primary.dark,
  outlineColor: props.hasError
    ? props.theme.colors.status.error
    : props.theme.colors.primary.dark,
  activeOutlineColor: props.hasError
    ? props.theme.colors.status.error
    : props.theme.colors.primary.dark,
  textColor: props.theme.colors.primary.dark,
  outlineStyle: {
    borderRadius: 8,
    padding: 0,
  },
}))`
  flex: 1;
  height: 60px;
  text-align: center;
  padding-left: 0;
  padding-right: 0;
  background-color: ${(props) => props.theme.colors.white};
  ${(props) => props.theme.typography.bodyLarge};
`;

const RegisterButton = styled(Button)``;

////////////  Styling end  ///////////////

const RecoveryConfirmationScreen: React.FC<
  RecoveryConfirmationScreenProps
> = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RecoveryConfirmationScreenNavigationProp>();
  const route =
    useRoute<RouteProp<RootStackParamList, "RecoveryConfirmation">>();
  const { email, phone } = route.params || {};
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [code, setCode] = useState<string>("");
  const [randomCode, setRandomCode] = useState<string>("1234");
  const inputs = useRef<RNTextInput[]>([]);
  const [isClipboardContent, setIsClipboardContent] = useState<boolean>(false);
  const [clipboardContent, setClipboardContent] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const theme = useTheme();
  const [errorMessage, setErrorMesage] = useState<string>("");

  useEffect(() => {
    setButtonDisabled(code.length !== 4);
  }, [code]);

  useEffect(() => {
    const checkClipboard = async () => {
      const clipboardContent = await Clipboard.getStringAsync();
      setClipboardContent(clipboardContent);
      if (clipboardContent.length === 4 && clipboardContent) {
        setIsClipboardContent(true);
      } else {
        setIsClipboardContent(false);
      }
    };
    checkClipboard();
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          return 180;
        }
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = code.split("");
    newCode[index] = value;
    setCode(newCode.join(""));
    setErrorMesage("");

    // Move to the next input if a character is entered
    if (value && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && index > 0 && !code[index]) {
      inputs.current[index - 1].focus();
      const newCode = code.split("");
      newCode[index - 1] = "";
      setCode(newCode.join(""));
    }
  };

  const handlePaste = async () => {
    if (clipboardContent.length === 4) {
      const newCode = clipboardContent.split("");
      setCode(clipboardContent);
      inputs.current.forEach((input, idx) => {
        if (input) {
          input.setNativeProps({ text: newCode[idx] });
        }
      });
    }
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

  const handleSubmit = () => {
    if (code !== randomCode) {
      setErrorMesage(t("conf_code_isnt_match"));
      setCode("");
      return;
    }

    console.log("Code entered:", code);
    setCode("");
    setErrorMesage("");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Background>
      <SafeArea>
        <ScreenContainer>
          <Header>
            <Text fontVariant="h3">
              {email && t("email_confirmation_title")}
              {phone && t("phone_confirmation_title")}
            </Text>
            <Text fontVariant="bodyMedium">
              {email && t("email_confirmation_description") + " "}
              {phone && t("phone_confirmation_description") + " "}
              {email
                ? obfuscateContactInfo(email)
                : obfuscateContactInfo(undefined, phone)}
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
                <InputBody>
                  <HelpTextWrapper>
                    <View>
                      <InfoText type="error" visible={!!errorMessage}>
                        {errorMessage}
                      </InfoText>
                    </View>

                    {isClipboardContent && (
                      <>
                        <Button
                          label={t("paste_code")}
                          mode="text"
                          onPress={handlePaste}
                        />
                      </>
                    )}
                  </HelpTextWrapper>
                  <InputWrapper>
                    {[0, 1, 2, 3].map((i) => (
                      <CodeInput
                        hasError={!!errorMessage}
                        key={i}
                        ref={(el: RNTextInput) => (inputs.current[i] = el!)}
                        value={code[i] || ""}
                        onChangeText={(value) => handleCodeChange(i, value)}
                        keyboardType="numeric"
                        maxLength={1}
                        onFocus={() => {}}
                        onKeyPress={({ nativeEvent: { key } }) =>
                          handleKeyPress(i, key)
                        }
                      />
                    ))}
                  </InputWrapper>
                  <View>
                    <Text
                      fontVariant="bodyMedium"
                      textColor={theme.colors.primary.dark}
                    >
                      {t("code_resend_notification")} {formatTime(timeLeft)}
                    </Text>
                  </View>
                </InputBody>
                <View>
                  <RegisterButton
                    label={t("send_code")}
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={buttonDisabled}
                  />
                </View>
              </FormWrapper>
              <Space height={16} />
            </ScrollView>
          </KeyboardAvoidingView>
        </ScreenContainer>
      </SafeArea>
    </Background>
  );
};

export default RecoveryConfirmationScreen;
