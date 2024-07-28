import React from "react";
import styled, { useTheme } from "styled-components/native";
import { Button as PaperButton } from "react-native-paper";
import { typography } from "../infrastructure/theme/typography";

//////////// Styling start ///////////////

const StyledButton = styled(PaperButton).attrs(() => ({
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

const TextButton = styled(PaperButton).attrs((props) => ({
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

const ContainedButton = styled(StyledButton).attrs((props) => ({
  mode: "contained",
}))`
  flex-grow: 1;
`;

const OutlinedButton = styled(StyledButton).attrs((props) => ({
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

//////////// Styling end ///////////////

interface ButtonProps {
  mode: "text" | "outlined" | "contained";
  label: string;
  icon?: string;
  disabled?: boolean;
  compact?: boolean;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({
  mode = "contained",
  label,
  icon,
  disabled = false,
  compact = false,
  onPress,
}) => {
  const theme = useTheme();

  if (mode === "text") {
    return (
      <TextButton
        icon={icon}
        disabled={disabled}
        compact={compact}
        onPress={onPress}
      >
        {label}
      </TextButton>
    );
  }

  if (mode === "outlined") {
    return (
      <OutlinedButton icon={icon} disabled={disabled} onPress={onPress}>
        {label}
      </OutlinedButton>
    );
  }

  return (
    <ContainedButton icon={icon} disabled={disabled} onPress={onPress}>
      {label}
    </ContainedButton>
  );
};

export default Button;
