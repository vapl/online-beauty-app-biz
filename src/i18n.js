import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import your translation files
import en from "./locales/en.json";
import lv from "./locales/lv.json";
import ru from "./locales/ru.json";

// Funkcija, lai iegūtu valodu no AsyncStorage
const getLanguage = async () => {
  let language = await AsyncStorage.getItem("language");
  return language || "en"; // Noklusējuma valoda ir angļu
};

getLanguage().then((language) => {
  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: {
        en: {
          translation: en,
        },
        lv: {
          translation: lv,
        },
        ru: {
          translation: ru,
        },
      },
      lng: language,
      fallbackLng: "en",
      debug: false,
      interpolation: {
        escapeValue: false,
      },
    });
});

export default i18n;
