import styled, { useTheme } from "styled-components/native";
import { Button as PaperButton, RadioButton } from "react-native-paper";
import { typography } from "../../infrastructure/theme/typography";
import { TextStyle, View, ViewStyle } from "react-native";

export interface StyledButtonProps {
  justifyContent?: ViewStyle["justifyContent"];
  disabled?: boolean;
  labelStyle?: TextStyle;
  labelColor?: string;
  buttonColor?: string;
}

export const StyledButton = styled(PaperButton).attrs<StyledButtonProps>(
  (props) => ({
    contentStyle: {
      height: 54,
      justifyContent: props.justifyContent || "center",
    },
    labelStyle: {
      ...typography.buttonLarge,
      ...props.labelStyle,
    },
  })
)<StyledButtonProps>`
  border-radius: 27px;
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.grey[40]
      : props.buttonColor || props.theme.colors.primary.dark};
`;

export const TextButton = styled(PaperButton).attrs((props) => ({
  mode: "text",
  compact: true,
  labelStyle: {
    ...typography.buttonMedium,
    color: props.disabled
      ? props.theme.colors.grey[60]
      : props.theme.colors.secondary.dark,
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 3,
    marginRight: 3,
    marginVertical: 0,
    marginHorizontal: 0,
  },
}))`
  align-self: flex-end;
`;

export const ContainedButton = styled(StyledButton).attrs<StyledButtonProps>(
  (props) => ({
    mode: "contained",
    textColor: props.labelColor || props.theme.colors.white,
  })
)`
  flex-grow: 1;
`;

export const OutlinedButton = styled(StyledButton).attrs<StyledButtonProps>(
  (props) => ({
    mode: "outlined",
    textColor: props.disabled
      ? props.theme.colors.grey[60]
      : props.labelColor || props.theme.colors.primary.dark,
    contentStyle: {
      // width: undefined,
      height: 52,
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
  /* width: undefined; */
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
