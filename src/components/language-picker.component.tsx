import React, { useEffect, useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components/native";
import { typography } from "../infrastructure/theme/typography";

const LanguagePicker: React.FC = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("lv"); // Default to Latvian

  const onChangeLanguage = (language: string) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  };

  const theme = useTheme();

  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  const pickerStyle = {
    inputIOS: {
      color: theme.colors.white,
      ...typography.buttonMedium,
      marginTop: 9,
      marginBottom: 9,
    },
    inputAndroid: {
      color: theme.colors.white,
      ...typography.buttonMedium,
      headlessAndroidContainer: false,
    },
  };

  return (
    <RNPickerSelect
      onValueChange={(value) => onChangeLanguage(value)}
      items={[
        { label: "🇱🇻 Latviešu", value: "lv" },
        { label: "🇬🇧 English", value: "en" },
        { label: "🇷🇺 Русский", value: "ru" },
      ]}
      style={pickerStyle}
      value={selectedLanguage}
      useNativeAndroidPickerStyle={false}
      Icon={() => {
        return null;
      }}
    />
  );
};

export default LanguagePicker;
