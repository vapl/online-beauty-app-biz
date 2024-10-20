import React from "react";
import {
  // StyledIcon,
  TextButton,
  OutlinedButton,
  ContainedButton,
  RadioButtonCustom,
  StyledButtonProps,
  TextButtonProps,
  RadioWrapper,
} from "./button.styles";
import Text from "../text.component";
import styled, { useTheme } from "styled-components/native";
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

//////////// Styling start ///////////////

//////////// Styling end ///////////////

interface ButtonProps extends StyledButtonProps, TextButtonProps {
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
  iconPosition?: "left" | "right";
  buttonSize?: "lg" | "sm";
  buttonPosition?: "left" | "center" | "right";
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
  iconPosition = "left",
  buttonSize = "lg",
  buttonPosition = "left",
  onPress = () => {},
}) => {
  const theme = useTheme();

  const handleIconColor = () => {
    if (disabled) {
      return theme.colors.grey[60];
    } else {
      if (mode === "outlined") {
        return iconColor || theme.colors.primary.dark;
      }
      if (mode === "text") {
        return iconColor || theme.colors.secondary.dark;
      }
      return iconColor || theme.colors.white;
    }
  };

  const renderIcon = () => {
    if (icon) {
      return (
        <Icon
          disabled={disabled}
          name={icon}
          size={iconSize}
          color={handleIconColor()}
        />
      );
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
        labelColor={labelColor}
        iconPosition={iconPosition}
        buttonPosition={buttonPosition}
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
        buttonSize={buttonSize}
        iconColor={iconColor}
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
      buttonSize={buttonSize}
    >
      {label}
    </ContainedButton>
  );
};

export default Button;
