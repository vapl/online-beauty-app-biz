import { DefaultTheme } from "styled-components/native";
import { darkColors, lightColors } from "./colors";
import { typography } from "./typography";
import { space } from "./spacing";
import { sizes } from "./sizes";

export const lightTheme: DefaultTheme = {
  colors: { ...lightColors, error: lightColors.status.warning },
  typography: typography,
  sizes: sizes,
  space: space,
};

export const darkTheme: DefaultTheme = {
  colors: { ...darkColors, error: lightColors.status.warning },
  typography: typography,
  sizes: sizes,
  space: space,
};
