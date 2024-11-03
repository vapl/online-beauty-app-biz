// App.js
import "react-native-gesture-handler";
import "intl-pluralrules";
import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import { I18nextProvider } from "react-i18next";
import * as SplashScreen from "expo-splash-screen";
import AppNavigator from "./src/navigation/AppNavigator";
import i18n from "./src/i18n";
import { ThemeProvider } from "./src/context/useThemeContext"; // Pārliecinies par precīzu ceļu uz ThemeProvider
import { AppRegistry, Platform } from "react-native";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import { StatusBar } from "react-native";
import LoadingSpinner from "./src/components/loading-spinner.component";
import AppProviders from "./src/context/AppProviders";
import ErrorBoundary from "./src/components/error-boundary.component";
import { enableScreens } from "react-native-screens";
import { RootSiblingParent } from "react-native-root-siblings";

enableScreens();
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

  return (
    <ThemeProvider>
      <AppProviders>
        <StatusBar />
        <LoadingSpinner isLoading={!dataLoaded} />
        <I18nextProvider i18n={i18n}>
          <ErrorBoundary>
            <RootSiblingParent>
              <AppNavigator />
            </RootSiblingParent>
          </ErrorBoundary>
        </I18nextProvider>
      </AppProviders>
    </ThemeProvider>
  );
}

AppRegistry.registerComponent("App", () => App);
