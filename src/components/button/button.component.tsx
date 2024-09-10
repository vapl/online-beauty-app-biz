import React from "react";
import {
  TextButton,
  OutlinedButton,
  ContainedButton,
  RadioButtonCustom,
  StyledButtonProps,
} from "./button.styles";
import Text from "../text.component";
import { useTheme } from "styled-components/native";
import { View } from "react-native";

//////////// Styling start ///////////////

//////////// Styling end ///////////////

interface ButtonProps extends StyledButtonProps {
  mode: "text" | "outlined" | "contained" | "radio" | "check";
  label?: string;
  icon?: string;
  disabled?: boolean;
  compact?: boolean;
  value?: string;
  status?: "checked" | "unchecked";
  onPress: () => void;
  onValueChange?: (value: string) => void;
}

const Button: React.FC<ButtonProps> = ({
  mode = "contained",
  label,
  icon,
  disabled = false,
  compact = false,
  value = "",
  status = "unchecked",
  justifyContent = "center",
  onPress,
  onValueChange,
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
      <OutlinedButton
        icon={icon}
        disabled={disabled}
        onPress={onPress}
        justifyContent={justifyContent}
      >
        {label}
      </OutlinedButton>
    );
  }

  if (mode === "radio") {
    return (
      <OutlinedButton
        icon={icon}
        disabled={disabled}
        onPress={onPress}
        justifyContent={justifyContent}
      >
        <RadioButtonCustom
          value={value}
          disabled={disabled}
          status={status}
          onPress={onPress}
        />
        <View>
          <Text
            textColor={
              status === "checked"
                ? theme.colors.primary.dark
                : theme.colors.grey[60]
            }
            onPress={onPress}
            fontVariant="buttonLarge"
          >
            {label}
          </Text>
        </View>
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
