import "react-native-gesture-handler";
import "intl-pluralrules";
import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import { I18nextProvider } from "react-i18next";
import * as SplashScreen from "expo-splash-screen";
import AppNavigator from "./src/navigation/AppNavigator";
import i18n from "./src/i18n";
import { ThemeProvider } from "styled-components/native";
import { AppRegistry, Switch } from "react-native";
import { lightTheme, darkTheme } from "./src/infrastructure/theme/theme";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import { StatusBar } from "react-native";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const fetchFonts = async () => {
  return Font.loadAsync({
    "Manrope-Bold": require("./assets/fonts/Manrope-Bold.ttf"),
    "Manrope-SemiBold": require("./assets/fonts/Manrope-SemiBold.ttf"),
    "Manrope-Regular": require("./assets/fonts/Manrope-Regular.ttf"),
  });
};

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  const theme = isDarkTheme ? darkTheme : lightTheme;

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await fetchFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setDataLoaded(true);
        await SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  useEffect(() => {
    changeNavigationBarColor(theme.colors.background, theme === darkTheme);
  }, [isDarkTheme]);

  if (!dataLoaded) {
    return null; // Return null to render nothing while loading
  }

  return (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <StatusBar
          barStyle={isDarkTheme ? "light-content" : "dark-content"}
          backgroundColor={theme.colors.background}
        />
        <AppNavigator />
        <Switch
          value={isDarkTheme}
          onValueChange={() => setIsDarkTheme((prev) => !prev)}
          style={{ position: "absolute", top: 40, right: 20 }}
        />
      </I18nextProvider>
    </ThemeProvider>
  );
}

// Register the main component
AppRegistry.registerComponent("main", () => App);
