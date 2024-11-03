import React from "react";
import { View } from "react-native";
import styled, { useTheme } from "styled-components/native";
import Text from "./text.component";
import Button from "./button/button.component";
import Ionicons from "@expo/vector-icons/Ionicons";
import { theme } from "../infrastructure/theme";

const SectionTitle = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.space.md}px;
`;

interface SectionHeaderProps {
  title: string;
  button?: boolean;
  buttonStyle?: "text" | "icon";
  icon?: keyof typeof Ionicons.glyphMap;
  buttonLabel?: string;
  buttonColor?: string;
  onPress?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  button = true,
  icon = "pencil",
  buttonColor = "#F98600",
  buttonStyle = "icon",
  buttonLabel,
  onPress,
}) => {
  return (
    <SectionTitle>
      <Text fontVariant="h5">{title}</Text>
      {button && (
        <Button
          mode={buttonStyle}
          iconName={icon}
          label={buttonLabel}
          labelColor={buttonColor}
          iconColor={buttonColor}
          onPress={onPress ? onPress : undefined}
        />
      )}
    </SectionTitle>
  );
};

export default SectionHeader;
