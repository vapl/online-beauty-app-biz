import React from "react";
import { TouchableOpacity } from "react-native";
import { Checkbox } from "react-native-paper";
import styled, { DefaultTheme } from "styled-components/native";

interface TextProps {
  textAlign?: "left" | "center" | "right";
  onPress?: () => void;
  showCheckbox?: boolean;
  checked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
  children?: React.ReactNode;
  textColor?: string;
  checkboxColor?: string;
  uncheckedColor?: string;
  fontVariant?: keyof typeof variants;
}

const defaultTextStyle = (theme: DefaultTheme, props: TextProps) => `
  font-family: ${theme.typography.bodyMedium.fontFamily};
  font-size: ${theme.typography.bodyMedium.fontSize}px;
  color: ${theme.colors.grey[100]};
  text-align: ${props.textAlign};
  flex-wrap: wrap;
  margin-top: 0px;
  margin-bottom: px;
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

const TextContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
`;

const StyledText = styled.Text.attrs(() => ({
  style: { backgroundColor: "transparent" },
}))<{
  fontVariant?: keyof typeof variants;
  color?: string;
  textAlign?: "left" | "center" | "right";
}>`
  ${({ theme, textAlign }) => defaultTextStyle(theme, { textAlign })}
  ${({ fontVariant, theme }) =>
    fontVariant && variants[fontVariant] ? variants[fontVariant](theme) : ""}
  ${({ color }) => (color ? `color: ${color};` : "")}
`;

const Text: React.FC<TextProps> = ({
  children,
  onPress,
  showCheckbox = false,
  checked = false,
  onCheckboxChange,
  textAlign = "left",
  textColor,
  checkboxColor,
  uncheckedColor,
  fontVariant = "bodyMedium",
}) => {
  return (
    <TextContainer onPress={onPress}>
      {showCheckbox && (
        <Checkbox.Android
          status={checked ? "checked" : "unchecked"}
          onPress={() => onCheckboxChange && onCheckboxChange(!checked)}
          uncheckedColor={uncheckedColor}
          color={checkboxColor}
        />
      )}
      <StyledText
        fontVariant={fontVariant}
        color={textColor}
        textAlign={textAlign}
      >
        {children}
      </StyledText>
    </TextContainer>
  );
};

export default Text;
