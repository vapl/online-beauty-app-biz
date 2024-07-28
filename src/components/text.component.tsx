import styled, { DefaultTheme } from "styled-components/native";
import { typography } from "../infrastructure/theme/typography";

const defaultTextStyle = (theme: DefaultTheme) => `
  font-family: ${theme.typography.bodyMedium.fontFamily};
  font-size: ${theme.typography.bodyMedium.fontSize}px;
  color: ${theme.colors.grey[100]};
  flex-wrap: wrap;
  margin-top: 0px;
  margin-bottom: 0px;
`;

const bodyLarge = (theme: DefaultTheme) => `
  font-family: ${theme.typography.bodyLarge.fontFamily};
  font-size: ${theme.typography.bodyLarge.fontSize}px;
`;

const bodyMedium = (theme: DefaultTheme) => `
  font-family: ${theme.typography.bodyMedium.fontFamily};
  font-size: ${theme.typography.bodyMedium.fontSize}px;
`;

const bodySmall = (theme: DefaultTheme) => `
  font-family: ${theme.typography.bodySmall.fontFamily};
  font-size: ${theme.typography.bodySmall.fontSize}px;
`;

const buttonLarge = (theme: DefaultTheme) => `
  font-family: ${theme.typography.buttonLarge.fontFamily};
  font-size: ${theme.typography.buttonLarge.fontSize}px;
`;

const buttonMedium = (theme: DefaultTheme) => `
  font-family: ${theme.typography.buttonMedium.fontFamily};
  font-size: ${theme.typography.buttonMedium.fontSize}px;
`;

const buttonSmall = (theme: DefaultTheme) => `
  font-family: ${theme.typography.buttonSmall.fontFamily};
  font-size: ${theme.typography.buttonSmall.fontSize}px;
`;

const h1 = (theme: DefaultTheme) => `
  font-family: ${theme.typography.h1.fontFamily};
  font-size: ${theme.typography.h1.fontSize}px;
`;

const h2 = (theme: DefaultTheme) => `
  font-family: ${theme.typography.h2.fontFamily};
  font-size: ${theme.typography.h2.fontSize}px;
`;

const h3 = (theme: DefaultTheme) => `
  font-family: ${theme.typography.h3.fontFamily};
  font-size: ${theme.typography.h3.fontSize}px;
`;

const h4 = (theme: DefaultTheme) => `
  font-family: ${theme.typography.h4.fontFamily};
  font-size: ${theme.typography.h4.fontSize}px;
`;

const h5 = (theme: DefaultTheme) => `
  font-family: ${theme.typography.h5.fontFamily};
  font-size: ${theme.typography.h5.fontSize}px;
`;

const h6 = (theme: DefaultTheme) => `
  font-family: ${theme.typography.h6.fontFamily};
  font-size: ${theme.typography.h6.fontSize}px;
`;

const variants = {
  bodyLarge,
  bodyMedium,
  bodySmall,
  buttonLarge,
  buttonMedium,
  buttonSmall,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
};

export const Text = styled.Text<{
  fontVariant?: keyof typeof variants;
  color?: string;
}>`
  ${({ theme }) => defaultTextStyle(theme)}
  ${({ fontVariant, theme }) =>
    fontVariant && variants[fontVariant] ? variants[fontVariant](theme) : ""}
  ${({ color }) => (color ? `color: ${color};` : "")}
`;
