import { DefaultTheme } from "styled-components/native";
import { darkColors, lightColors } from "./colors";
import { typography } from "./typography";
import { space } from "./spacing";
import { sizes } from "./sizes";

export const lightTheme: DefaultTheme = {
  colors: lightColors,
  typography: typography,
  sizes: sizes,
  space: space,
};

export const darkTheme: DefaultTheme = {
  colors: darkColors,
  typography: typography,
  sizes: sizes,
  space: space,
};
