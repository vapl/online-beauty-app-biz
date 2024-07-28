import "styled-components/native";

declare module "styled-components/native" {
  export interface DefaultTheme {
    colors: {
      primary: {
        dark: string;
        lighter: string;
        light: string;
      };
      secondary: {
        dark: string;
        light: string;
      };
      accent: {
        darkPink: string;
        lightPink: string;
      };
      status: {
        warning: string;
        success: string;
        info: string;
      };
      grey: {
        100: string;
        80: string;
        60: string;
        40: string;
        20: string;
        10: string;
      };
      white: string;
      background: string;
      text: string;
    };
    typography: {
      h1: {
        fontFamily: string;
        fontSize: number;
      };
      h2: {
        fontFamily: string;
        fontSize: number;
      };
      h3: {
        fontFamily: string;
        fontSize: number;
      };
      h4: {
        fontFamily: string;
        fontSize: number;
      };
      h5: {
        fontFamily: string;
        fontSize: number;
      };
      h6: {
        fontFamily: string;
        fontSize: number;
      };
      bodyLarge: {
        fontFamily: string;
        fontSize: number;
      };
      bodyMedium: {
        fontFamily: string;
        fontSize: number;
      };
      bodySmall: {
        fontFamily: string;
        fontSize: number;
      };
      buttonLarge: {
        fontFamily: string;
        fontSize: number;
      };
      buttonMedium: {
        fontFamily: string;
        fontSize: number;
      };
      buttonSmall: {
        fontFamily: string;
        fontSize: number;
      };
    };
    sizes: {
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      xxxl: number;
    };
    space: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      xxxl: number;
    };
  }
}
