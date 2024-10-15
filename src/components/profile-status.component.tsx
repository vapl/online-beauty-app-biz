import React from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import Text from "./text.component";
import styled, { useTheme } from "styled-components/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

// start -> styles
const Container = styled(View)`
  width: 100%;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 8px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
  padding: 8px;
  margin-bottom: 16px;
  gap: 8px;
`;

const Header = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

const HeaderRightWrapper = styled(View)`
  flex-direction: row;
  gap: 6px;
  align-items: center;
  height: 20px;
`;

const StatusIndicatorWrapper = styled(View)`
  flex-direction: row;
  gap: 4px;
  align-items: center;
`;

const StatusIndicatorItem = styled(View)`
  height: 6px;
  flex: 1;
  background-color: ${(props) => props.theme.colors.grey[40]};
  border-radius: 3px;
`;
// end <- styles

interface ProfileStatusProps {
  quantity: number;
  completed: number;
  onPress: () => void;
}

const ProfileStatusComponent: React.FC<ProfileStatusProps> = ({
  quantity = 5,
  completed = 0,
  onPress,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const renderCompletedColor = (index: number) => {
    if (completed >= index + 1) {
      return theme.colors.secondary.dark;
    } else {
      return theme.colors.grey[40];
    }
  };
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.5}>
      <Container style={{ display: completed === quantity ? "none" : "flex" }}>
        <Header>
          <Text fontVariant="bodySmall" pressable={false}>
            {t("business_profile_status")}
          </Text>
          <HeaderRightWrapper>
            <Text fontVariant="bodySmall">
              {`${completed} / ${quantity} ${t(
                "business_profile_status_finished"
              )}`}
            </Text>
            <Ionicons
              name="chevron-forward-outline"
              color={theme.colors.primary.dark}
              size={14}
            />
          </HeaderRightWrapper>
        </Header>
        <StatusIndicatorWrapper>
          {Array.from({ length: quantity }).map((_, index) => (
            <StatusIndicatorItem
              key={index}
              style={{ backgroundColor: renderCompletedColor(index) }}
            />
          ))}
        </StatusIndicatorWrapper>
      </Container>
    </TouchableOpacity>
  );
};

export default ProfileStatusComponent;
