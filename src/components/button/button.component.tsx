import React from "react";
import {
  StyledButton,
  TextButton,
  OutlinedButton,
  ContainedButton,
} from "./button.styles";

//////////// Styling start ///////////////

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
  // const theme = useTheme();

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
