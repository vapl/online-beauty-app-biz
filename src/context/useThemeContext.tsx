import Reac, { createContext, ReactNode, useContext, useState } from "react";
import { lightTheme, darkTheme } from "../infrastructure/theme/theme";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext({
  isDarkTheme: false,
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  const theme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
