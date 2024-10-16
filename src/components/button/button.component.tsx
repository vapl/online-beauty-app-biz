import React from "react";
import {
  TextButton,
  OutlinedButton,
  ContainedButton,
  RadioButtonCustom,
  StyledButtonProps,
  RadioWrapper,
} from "./button.styles";
import Text from "../text.component";
import styled, { useTheme } from "styled-components/native";
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

//////////// Styling start ///////////////

//////////// Styling end ///////////////

interface ButtonProps extends StyledButtonProps {
  mode: "text" | "outlined" | "contained" | "radio" | "check" | "icon";
  label?: string;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  disabled?: boolean;
  compact?: boolean;
  value?: any;
  status?: "checked" | "unchecked";
  buttonColor?: string;
  onPress?: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
}

const Button: React.FC<ButtonProps> = ({
  mode = "contained",
  label,
  icon,
  iconSize = 24,
  iconColor,
  disabled = false,
  compact = false,
  value = "",
  status = "unchecked",
  justifyContent = "center",
  labelStyle,
  labelColor,
  buttonColor,
  iconName = "home",
  onPress = () => {},
}) => {
  const theme = useTheme();

  const renderIcon = () => {
    if (icon) {
      return <Icon name={icon} size={iconSize} color={iconColor} />;
    }
  };

  if (mode === "text") {
    return (
      <TextButton
        icon={renderIcon}
        disabled={disabled}
        compact={compact}
        onPress={onPress}
        labelStyle={labelStyle}
      >
        {label}
      </TextButton>
    );
  }

  if (mode === "outlined") {
    return (
      <OutlinedButton
        icon={renderIcon}
        disabled={disabled}
        onPress={onPress}
        justifyContent={justifyContent}
        labelStyle={labelStyle}
        labelColor={labelColor}
      >
        {label}
      </OutlinedButton>
    );
  }

  if (mode === "radio") {
    return (
      <OutlinedButton
        icon={renderIcon}
        disabled={disabled}
        onPress={onPress}
        justifyContent="flex-start"
      >
        <RadioWrapper>
          <RadioButtonCustom
            value={value}
            disabled={disabled}
            status={status}
            onPress={onPress}
          />
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
        </RadioWrapper>
      </OutlinedButton>
    );
  }

  if (mode === "icon") {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.2}>
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
      </TouchableOpacity>
    );
  }

  return (
    <ContainedButton
      icon={renderIcon}
      disabled={disabled}
      onPress={onPress}
      buttonColor={buttonColor}
      labelColor={labelColor}
    >
      {label}
    </ContainedButton>
  );
};

export default Button;
