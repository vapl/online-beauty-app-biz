import "react-native-gesture-handler";
import "intl-pluralrules";
import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import { I18nextProvider } from "react-i18next";
import * as SplashScreen from "expo-splash-screen";
import AppNavigator from "./src/navigation/AppNavigator";
import i18n from "./src/i18n";
import styled, { useTheme } from "styled-components/native";
import { ThemeProvider } from "./src/context/useThemeContext";
import { useThemeContext } from "./src/context/useThemeContext";
import { AppRegistry, SafeAreaView, Switch, View } from "react-native";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import { StatusBar } from "react-native";
import LoadingSpinner from "./src/components/loading-spinner.component";
import { UserProvider } from "./src/context/UserProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppProviders from "./src/context/AppProviders";
import ErrorBoundary from "./src/components/error-boundary.component";
import { enableScreens } from "react-native-screens";

enableScreens();

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
  const queryClient = new QueryClient();
  const { isDarkTheme } = useThemeContext();

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
    changeNavigationBarColor(isDarkTheme ? "black" : "white", isDarkTheme);
  }, [isDarkTheme]);

  return (
    <AppProviders>
      <StatusBar />
      <ThemeProvider>
        {!dataLoaded && <LoadingSpinner />}
        <I18nextProvider i18n={i18n}>
          <ErrorBoundary>
            <AppNavigator />
          </ErrorBoundary>
        </I18nextProvider>
      </ThemeProvider>
    </AppProviders>
  );
}

// Register the main component
AppRegistry.registerComponent("main", () => App);
