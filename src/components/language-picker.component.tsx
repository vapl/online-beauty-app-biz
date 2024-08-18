import React, { useEffect, useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components/native";
import { typography } from "../infrastructure/theme/typography";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LanguagePickerProps {
  color?: string;
}

const LanguagePicker: React.FC<LanguagePickerProps> = ({ color }) => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("lv"); // Default to Latvian

  const onChangeLanguage = async (language: string) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
    await AsyncStorage.setItem("userLanguage", language);
  };

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("userLanguage");
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
        setSelectedLanguage(savedLanguage);
      }
    };
    loadLanguage();
  }, []);

  const pickerStyle = {
    inputIOS: {
      color: color,
      ...typography.buttonMedium,
      marginTop: 9,
      marginBottom: 9,
    },
    inputAndroid: {
      color: color,
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
