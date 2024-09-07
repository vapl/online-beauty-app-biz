import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { Text } from "./text.component";
import styled, { useTheme } from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface ServiceCardProps {
  label?: string;
  icon?: any;
  selected?: boolean;
  isMainService?: boolean;
  choiceStatus?: string;
  onPress: () => void;
}

const CardContainer = styled(TouchableOpacity)<{ selected: boolean }>`
  border: ${({ selected, theme }) =>
    `${selected ? "2px" : "1px"} solid ${
      selected ? theme.colors.primary.dark : theme.colors.grey[40]
    }`};
  height: 220px;
  width: 48%;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const IconContainer = styled.View`
  margin-bottom: 30px;
`;

const LabelText = styled(Text)`
  font-size: ${(props) => props.theme.sizes.md}px;
  text-align: center;
`;

const ChoiceLabel = styled.View`
  position: absolute;
  top: 5px;
  right: 5px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.colors.secondary.dark};
  padding: 0 8px 0 8px;
  justify-content: center;
  align-items: center;
  min-width: 25px;
  height: 25px;
`;

const ServiceCard: React.FC<ServiceCardProps> = ({
  label,
  icon = "scissors-cutting",
  selected = false,
  isMainService = false,
  choiceStatus = "",
  onPress,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <CardContainer onPress={onPress} selected={selected}>
      {choiceStatus !== "" && (
        <ChoiceLabel>
          {isMainService ? (
            <Text fontVariant="buttonSmall" color="white">
              {t("main_status")}
            </Text>
          ) : (
            <Text fontVariant="buttonSmall" color="white">
              {choiceStatus}
            </Text>
          )}
        </ChoiceLabel>
      )}
      <IconContainer>
        <Image
          source={icon}
          style={{ width: 60, height: 60 }}
          resizeMode="contain"
        />
      </IconContainer>
      <LabelText>{label}</LabelText>
    </CardContainer>
  );
};

export default ServiceCard;
