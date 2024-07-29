import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components/native";
import { View, Platform } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import { TouchableOpacity } from "react-native-gesture-handler";

interface StyledInputProps {
  hasError?: boolean;
}

const StyledInput = styled(TextInput).attrs<StyledInputProps>((props) => ({
  mode: "outlined",
  selectionColor: props.theme.colors.primary.dark,
  cursorColor: props.theme.colors.primary.dark,
  outlineColor: props.hasError
    ? props.theme.colors.status.warning
    : props.theme.colors.primary.dark,
  activeOutlineColor: props.hasError
    ? props.theme.colors.status.warning
    : props.theme.colors.primary.dark,
  textColor: props.hasError
    ? props.theme.colors.status.warning
    : props.theme.colors.primary.dark,
  underlineStyle: {
    borderColor: props.theme.colors.status.warning,
  },
  outlineStyle: {
    borderRadius: 27,
    paddingTop: 0,
  },
}))`
  flex-grow: 1;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
  background-color: ${(props) => props.theme.colors.white};
  ${(props) => props.theme.typography.bodyLarge};
`;

const CountryCodePicker = styled(CountryPicker).attrs(() => ({
  withModal: true,
  withAlphaFilter: false,
  withCallingCode: true,
  withCallingCodeButton: true,
  withFlag: true,
  withEmoji: true,
  withFilter: true,
  containerButtonStyle: {
    justifyContent: "center",
  },
}))``;

const InputWrapper = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  gap: 8px;
`;

const CountryCodePickerWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  border: 1px ${(props) => props.theme.colors.primary.dark} solid;
  border-radius: 27px;
  height: 50px;
  padding-left: 16px;
`;

const ChevronIconWrapper = styled(View)`
  justify-content: center;
  padding: 16px;
`;

const ErrorWrapper = styled(View)`
  justify-content: left;
  flex-grow: 1;
`;

const InfoText = styled(HelperText)`
  ${(props) => props.theme.typography.bodySmall};
  color: ${(props) => props.theme.colors.status.warning};
`;

interface InputProps {
  value: string;
  label: string;
  errorMessage?: string;
  iconLeft?: string;
  iconRight?: string;
  required?: boolean;
  multiline?: boolean;
  secureTextEntry?: boolean;
  autoCorrect?: boolean;
  countryCodePicker?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "ascii-capable"
    | "visible-password";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  textContentType?:
    | "none"
    | "emailAddress"
    | "password"
    | "name"
    | "familyName"
    | "givenName";
  onChangeText: (text: string) => void;
  validate?: (value: string) => string | undefined;
  onFocus?: () => void;
  onBlur?: () => void;
  onPress?: () => void;
  onSubmitEditing?: () => void;
  setCallingCode?: (code: string) => void;
  returnKeyType?:
    | "default"
    | "go"
    | "google"
    | "join"
    | "next"
    | "route"
    | "search"
    | "send"
    | "yahoo"
    | "done"
    | "emergency-call";
}

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  secureTextEntry = false,
  autoCorrect = true,
  keyboardType = "default",
  autoCapitalize = "none",
  textContentType = "none",
  label,
  required,
  errorMessage,
  multiline = false,
  iconLeft = "",
  iconRight = "close",
  onSubmitEditing,
  returnKeyType,
  countryCodePicker = false,
  setCallingCode,
}) => {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [secureText, setSecureText] = useState<boolean>(secureTextEntry);
  const [countryCode, setCountryCode] = useState<CountryCode>("LV");
  const [pickerVisible, setPickerVisible] = useState<boolean>(false);
  const theme = useTheme();

  const handleEmailInputValue = (text: string) => {
    const filteredText = text.replace(/[^\w@.-]/g, "");
    onChangeText(filteredText);
  };

  useEffect(() => {
    if (!secureText) {
      setSecureText(false);
    }
  }, [secureText]);

  const getRightIcon = () => {
    if (isFocused && value !== "" && !secureTextEntry) {
      if (!secureText) {
        return (
          <TextInput.Icon icon={iconRight} onPress={() => onChangeText("")} />
        );
      }
    }

    if (secureTextEntry && isFocused && value !== "") {
      return (
        <TextInput.Icon
          icon={secureText ? "eye" : "eye-off"}
          onPress={toggleSecureText}
        />
      );
    }

    return null;
  };

  const toggleSecureText = () => {
    setSecureText(!secureText);
  };

  const handleCountrySelect = (country: {
    cca2: CountryCode;
    callingCode: string[];
  }) => {
    setCountryCode(country.cca2);
    if (setCallingCode) {
      setCallingCode(country.callingCode[0]);
    }
  };

  return (
    <>
      <ErrorWrapper>
        <InputWrapper>
          {countryCodePicker && (
            <CountryCodePickerWrapper>
              <CountryCodePicker
                countryCode={countryCode}
                onSelect={handleCountrySelect}
                visible={pickerVisible}
                onClose={() => setPickerVisible(false)}
              />
              <TouchableOpacity onPress={() => setPickerVisible(true)}>
                <ChevronIconWrapper>
                  <TextInput.Icon icon="chevron-down" />
                </ChevronIconWrapper>
              </TouchableOpacity>
            </CountryCodePickerWrapper>
          )}
          <StyledInput
            theme={theme}
            value={value}
            label={required ? label : label}
            hasError={!!errorMessage}
            onChangeText={
              keyboardType === "email-address"
                ? handleEmailInputValue
                : onChangeText
            }
            multiline={multiline}
            autoCorrect={autoCorrect}
            secureTextEntry={secureTextEntry ? secureText : false}
            keyboardType={
              secureTextEntry
                ? Platform.OS === "ios"
                  ? "ascii-capable"
                  : "visible-password"
                : keyboardType
            }
            autoCapitalize={autoCapitalize}
            textContentType={secureTextEntry ? "password" : textContentType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            contextMenuHidden={true}
            error={!!errorMessage}
            onSubmitEditing={onSubmitEditing} // Prop for handling submit on return key
            returnKeyType={returnKeyType} // Prop for setting return key type
            left={
              !isFocused && value === "" ? (
                <TextInput.Icon icon={iconLeft} />
              ) : null
            }
            style={
              !isFocused && value === ""
                ? { paddingLeft: 0 }
                : { paddingLeft: 16 }
            }
            right={getRightIcon()}
          />
        </InputWrapper>
        {errorMessage && (
          <InfoText type="error" visible={!!errorMessage}>
            {t(errorMessage)}
          </InfoText>
        )}
      </ErrorWrapper>
    </>
  );
};

export default Input;
