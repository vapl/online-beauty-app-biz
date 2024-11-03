import React, { useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components/native";
import {
  View,
  Platform,
  Pressable,
  TextInput as RNTextInput,
} from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-native-phone-input";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import { darkTheme } from "../../infrastructure/theme/theme";
import Ionicons from "@expo/vector-icons/Ionicons";

interface StyledInputProps {
  hasError?: boolean;
  disabled?: boolean;
  borderRadius?: number;
  maxLength?: number;
  numberOfLines?: number;
}

const StyledInput = styled(TextInput).attrs<StyledInputProps>((props) => ({
  mode: "outlined",
  selectionColor: props.theme.colors.primary.dark,
  cursorColor: props.theme.colors.primary.dark,
  outlineColor: props.hasError
    ? props.theme.colors.status.error
    : props.theme.colors.primary.dark,
  activeOutlineColor: props.hasError
    ? props.theme.colors.status.error
    : props.theme.colors.primary.dark,
  textColor: props.hasError
    ? props.theme.colors.status.error
    : props.theme.colors.primary.dark,
  underlineStyle: {
    borderColor: props.theme.colors.status.error,
  },
  outlineStyle: {
    borderRadius: props.borderRadius || 27,
    paddingTop: 0,
  },
  editable: !props.disabled,
  maxLength: props.maxLength,
  numberOfLines: props.numberOfLines,
}))`
  flex-grow: 1;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.grey[20]
      : props.theme.colors.background};
  ${(props) => props.theme.typography.bodyMedium};
`;

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
  min-height: 50px;
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
  color: ${(props) => props.theme.colors.status.error};
`;

interface InputProps {
  value: string;
  label: string;
  errorMessage?: string;
  iconLeft?: string;
  iconRight?: string;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
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
  disabled?: boolean;
  editable?: boolean;
  autoFocus?: boolean;
  borderRadius?: number;
  inputMode?:
    | "none"
    | "text"
    | "decimal"
    | "numeric"
    | "tel"
    | "search"
    | "email"
    | "url";
  enableEditIcon?: boolean;
  [key: string]: any;
}

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  secureTextEntry = false,
  autoCorrect = true,
  keyboardType = "default",
  autoCapitalize = "none",
  textContentType = "none",
  inputMode = "text",
  label,
  required,
  errorMessage,
  multiline = false,
  numberOfLines,
  maxLength,
  iconLeft = "",
  iconRight = "close",
  onSubmitEditing,
  returnKeyType,
  countryCodePicker = false,
  setCallingCode,
  disabled = false,
  editable = true,
  autoFocus,
  borderRadius,
  onFocus,
  onBlur,
  enableEditIcon = false,
  ...props
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isMultiline, setIsMultiline] = useState<boolean>(false);
  const [secureText, setSecureText] = useState<boolean>(secureTextEntry);
  const [pickerVisible, setPickerVisible] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(
    editable && !enableEditIcon
  );

  const inputRef = useRef<RNTextInput>(null);

  const phoneInputRef = useRef<PhoneInput>(null);
  const [countryCode, setCountryCode] = useState<CountryCode>("LV");
  const [callingCode, setCallingCodeState] = useState<string>("371");
  const [phoneNumber, setPhoneNumber] = useState<string>(value);

  const handleEditIconPress = () => {
    setIsEditable(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleEmailInputValue = (text: string) => {
    const filteredText = text.replace(/[^\w@.-]/g, "");
    onChangeText(filteredText);
  };

  useEffect(() => {
    if (!secureText) {
      setSecureText(false);
    }
  }, [secureText]);

  useEffect(() => {
    setIsMultiline(multiline);
  }, [multiline]);

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

    if (enableEditIcon && !isFocused && !isEditable) {
      return (
        <TextInput.Icon
          icon={() => (
            <Ionicons
              name={!isFocused && !isEditable ? "pencil" : "close"}
              color={theme.colors.secondary.dark}
              size={24}
            />
          )}
          onPress={handleEditIconPress}
        />
      );
    }

    return null;
  };

  const toggleSecureText = () => {
    setSecureText(!secureText);
  };

  useEffect(() => {
    // Atjaunina sākotnējo valsts kodu
    if (phoneInputRef.current) {
      phoneInputRef.current.setValue(`+${callingCode}`);
    }
  }, [callingCode]);

  const handleCountrySelect = (country: {
    cca2: CountryCode;
    callingCode: string[];
  }) => {
    setCountryCode(country.cca2);
    const fullNumber = `+${country.callingCode[0]}${phoneNumber}`;
    const newCallingCode = country.callingCode[0];
    onChangeText(fullNumber);
    setCallingCodeState(newCallingCode);

    // Iestatīt PhoneInput lauku ar jauno valsts kodu
    if (phoneInputRef.current) {
      phoneInputRef.current.setValue(`+${newCallingCode}`);
    }

    if (setCallingCode) {
      setCallingCode(newCallingCode);
    }
  };

  const handlePhoneInputChange = (text: string) => {
    onChangeText(text);
    const fullNumber = `+${callingCode}${text}`;
    onChangeText(fullNumber);
  };

  const pickerTheme = {
    backgroundColor:
      theme === darkTheme
        ? darkTheme.colors.background
        : theme.colors.background,
    onBackgroundTextColor:
      theme === darkTheme ? darkTheme.colors.text : theme.colors.text,
    fontSize: 18, // Var pielāgot pēc nepieciešamības
    flagSize: 32, // Var pielāgot pēc nepieciešamības
  };

  return (
    <>
      <ErrorWrapper>
        <InputWrapper>
          {countryCodePicker && (
            <>
              <CountryCodePickerWrapper>
                <PhoneInput
                  ref={phoneInputRef}
                  onPressFlag={() => setPickerVisible(true)}
                  initialValue={value}
                  textProps={{ placeholder: "Enter phone number" }}
                  textStyle={{
                    color: theme.colors.primary.dark,
                  }}
                  initialCountry={countryCode.toLowerCase()}
                  onChangePhoneNumber={handlePhoneInputChange}
                  style={{
                    // flexGrow: 1,
                    minWidth: 75,
                    ...theme.typography.bodySmall,
                  }}
                />
                <ChevronIconWrapper>
                  <TextInput.Icon
                    icon="chevron-down"
                    onPress={() => setPickerVisible(true)}
                  />
                </ChevronIconWrapper>
              </CountryCodePickerWrapper>
              <CountryPicker
                countryCode={countryCode}
                theme={pickerTheme}
                withCallingCodeButton={false}
                withFilter
                withFlag
                withCallingCode
                withAlphaFilter
                withEmoji={false}
                withFlagButton={false}
                onSelect={handleCountrySelect}
                visible={pickerVisible}
                onClose={() => setPickerVisible(false)}
                translation="common"
              />
            </>
          )}
          <StyledInput
            inputMode={inputMode}
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
            maxLength={maxLength}
            borderRadius={borderRadius}
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
            onFocus={() => {
              if (onFocus) onFocus();
              setIsFocused(true);
            }}
            onBlur={() => {
              if (onBlur) onBlur();
              if (enableEditIcon) {
                setIsEditable(false);
              }
              setIsFocused(false);
            }}
            autoFocus={autoFocus}
            render={(props) => (
              <RNTextInput
                {...props}
                ref={inputRef}
                editable={isEditable}
                selectTextOnFocus={false}
                numberOfLines={numberOfLines}
              />
            )}
            contextMenuHidden={false}
            error={!!errorMessage}
            onSubmitEditing={onSubmitEditing} // Prop for handling submit on return key
            returnKeyType={returnKeyType} // Prop for setting return key type
            left={
              !isFocused && value === "" && iconLeft ? (
                <TextInput.Icon icon={iconLeft} />
              ) : null
            }
            style={{
              paddingLeft:
                !isFocused && value === "" ? 0 : isMultiline ? 0 : 16,
              ...(!isFocused && isMultiline
                ? { maxHeight: 200, minHeight: 150 }
                : { paddingLeft: 8 }),
              ...(isMultiline ? { minHeight: 150 } : {}),
            }}
            right={getRightIcon()}
            disabled={disabled}
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
