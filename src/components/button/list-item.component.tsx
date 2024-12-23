import React from "react";
import { TouchableOpacity, View } from "react-native";
import Text from "../text.component";
import styled, { useTheme } from "styled-components/native";
import { Icon } from "react-native-paper";

const ItemContainer = styled(View)<{ botLine?: boolean; topLine?: boolean }>`
  flex-direction: row;
  width: 100%;
  max-width: 500px;
  ${(props) =>
    props.botLine
      ? `border-bottom-width: 1px; border-bottom-color: ${props.theme.colors.grey[40]};`
      : `border-top-width: 1px; border-top-color: ${props.theme.colors.grey[40]};`}
  padding-top: ${(props) => props.theme.space.md}px;
  padding-bottom: ${(props) => props.theme.space.md}px;
  align-items: center;
  justify-content: space-between;
`;

const ContentWrapper = styled(View)`
  width: 70%;
`;

const LeftIconContainer = styled(View)<ListItemProps>`
  height: 40px;
  width: 40px;
  border-radius: ${(props) =>
    props.leftIconContainerBorderRadius
      ? `${props.leftIconContainerBorderRadius}px`
      : "50%"};
  background-color: ${(props) =>
    props.lefIconContainerBackground || props.theme.colors.grey[60]};
  border: ${(props) =>
    props.leftIconContainerBorder
      ? `1px solid ${props.theme.colors.grey[60]}`
      : "none"};
  justify-content: center;
  align-items: center;
  margin-right: ${(props) => props.theme.space.md}px;
`;

interface ListItemProps {
  title: string;
  subtitle?: string;
  iconLeft?: React.ReactNode;
  topLine?: boolean;
  botLine?: boolean;
  lefIconContainerBackground?: string;
  leftIconContainerBorder?: boolean;
  leftIconContainerBorderRadius?: number;
  onPress?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  iconLeft,
  topLine = false,
  botLine = true,
  lefIconContainerBackground,
  leftIconContainerBorder = false,
  leftIconContainerBorderRadius,
  onPress = () => {},
}) => {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress}>
      <ItemContainer topLine={topLine} botLine={botLine}>
        {iconLeft && (
          <LeftIconContainer
            title={title}
            lefIconContainerBackground={lefIconContainerBackground}
            leftIconContainerBorder={leftIconContainerBorder}
            leftIconContainerBorderRadius={leftIconContainerBorderRadius}
          >
            {iconLeft}
          </LeftIconContainer>
        )}
        <ContentWrapper>
          <Text fontVariant="buttonMedium">{title}</Text>
          {subtitle && (
            <Text fontVariant="bodySmall" textColor={theme.colors.grey[80]}>
              {subtitle}
            </Text>
          )}
        </ContentWrapper>
        <Icon
          source="chevron-right"
          size={24}
          color={theme.colors.primary.dark}
        />
      </ItemContainer>
    </TouchableOpacity>
  );
};

export default ListItem;
