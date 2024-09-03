import styled, { useTheme } from "styled-components/native";
import { Button as PaperButton } from "react-native-paper";
import { typography } from "../../infrastructure/theme/typography";

export const StyledButton = styled(PaperButton).attrs(() => ({
  contentStyle: {
    height: 54,
  },
  labelStyle: {
    ...typography.buttonLarge,
  },
}))`
  border-radius: 27px;
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.grey[40]
      : props.theme.colors.primary.dark};
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

export const ContainedButton = styled(StyledButton).attrs((props) => ({
  mode: "contained",
}))`
  flex-grow: 1;
`;

export const OutlinedButton = styled(StyledButton).attrs((props) => ({
  mode: "outlined",
  textColor: props.disabled
    ? props.theme.colors.grey[60]
    : props.theme.colors.primary.dark,
  contentStyle: {
    width: undefined,
    height: 52,
  },
}))`
  background-color: undefined;
  border-color: ${(props) =>
    props.disabled
      ? props.theme.colors.grey[60]
      : props.theme.colors.primary.dark};
  width: undefined;
`;
