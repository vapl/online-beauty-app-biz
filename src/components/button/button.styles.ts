import styled, { useTheme } from "styled-components/native";
import { Button as PaperButton, RadioButton } from "react-native-paper";
import { typography } from "../../infrastructure/theme/typography";
import { TextStyle, View, ViewStyle } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export interface StyledButtonProps {
  justifyContent?: ViewStyle["justifyContent"];
  disabled?: boolean;
  labelStyle?: TextStyle;
  iconColor?: string;
  labelColor?: string;
  buttonColor?: string;
  buttonSize?: "lg" | "sm";
  mode?: "text" | "outlined" | "contained" | "radio" | "check" | "icon";
}

export interface TextButtonProps {
  iconPosition?: "left" | "right";
  buttonPosition?: "left" | "center" | "right";
  labelColor?: string;
}

export const StyledButton = styled(PaperButton).attrs<StyledButtonProps>(
  (props) => ({
    contentStyle: {
      height: props.buttonSize === "lg" ? 54 : 44,
      justifyContent: props.justifyContent || "center",
    },
    labelStyle: {
      ...typography.buttonLarge,
      // ...props.labelStyle,
    },
  })
)<StyledButtonProps>`
  border-radius: 27px;
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.grey[40]
      : props.buttonColor || props.theme.colors.primary.dark};
`;

export const TextButton = styled(PaperButton).attrs<TextButtonProps>(
  (props) => ({
    mode: "text",
    compact: true,
    labelStyle: {
      ...typography.buttonMedium,
      color: props.disabled
        ? props.theme.colors.grey[60]
        : props.labelColor || props.theme.colors.secondary.dark,
      marginVertical: 0,
      marginHorizontal: 0,
      marginLeft: props.iconPosition === "left" ? 6 : 0,
      marginRight: props.iconPosition === "right" ? 6 : 0,
    },
    contentStyle: {
      flexDirection: props.iconPosition === "left" ? "row" : "row-reverse",
    },
  })
)<TextButtonProps>`
  align-self: ${(props) => {
    switch (props.buttonPosition) {
      case "left":
        return "flex-start";
      case "center":
        return "center";
      case "right":
        return "flex-end";
      default:
        "flex-end";
        break;
    }
  }};
`;

export const ContainedButton = styled(StyledButton).attrs<StyledButtonProps>(
  (props) => ({
    mode: "contained",
    textColor: props.labelColor || props.theme.colors.white,
    labelStyle: {
      ...typography.buttonLarge,
      color: props.disabled
        ? props.theme.colors.grey[60]
        : props.labelColor || props.theme.colors.white,
    },
  })
)`
  flex-grow: 1;
`;

export const OutlinedButton = styled(StyledButton).attrs<StyledButtonProps>(
  (props) => ({
    mode: "outlined",
    labelStyle: {
      ...typography.buttonLarge,
      color: props.disabled
        ? props.theme.colors.grey[60]
        : props.labelColor || props.theme.colors.primary.dark,
    },
    // textColor: props.disabled
    //   ? props.theme.colors.grey[60]
    //   : props.labelColor || props.theme.colors.primary.dark,
    contentStyle: {
      height: props.buttonSize === "lg" ? 52 : 42,
      justifyContent: props.justifyContent,
      paddingLeft: 0,
    },
  })
)<StyledButtonProps>`
  background-color: undefined;
  border-color: ${(props) =>
    props.disabled
      ? props.theme.colors.grey[60]
      : props.theme.colors.primary.dark};
  justify-content: center;
  flex-grow: 1;
`;

export const RadioButtonCustom = styled(RadioButton.Android).attrs((props) => ({
  color: props.disabled
    ? props.theme.colors.grey[60]
    : props.theme.colors.primary.dark,
  uncheckedColor: props.theme.colors.grey[60],
}))``;

export const RadioWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  padding-top: 4px;
  margin-left: -8px;
  gap: ${(props) => props.theme.space.sm}px;
`;
