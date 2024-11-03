import React, { ReactNode, useState } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import LoadingSpinner from "../loading-spinner.component";
import Text from "../text.component";
import Space from "../spacer.component";
import { useTranslation } from "react-i18next";

const Card = styled(View)`
  width: 100%;
  min-height: 50px;
  border: 1px solid ${(props) => props.theme.colors.grey[60]};
  border-radius: 8px;
  padding-left: 8px;
  padding-right: 8px;
  justify-content: center;
  align-items: center;
`;

const CardHorizontalDivider = styled(View)`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.colors.grey[60]};
  border-radius: 0.5px;
`;

const CardContent = styled(View)`
  width: 100%;
  flex-direction: row;
  padding-top: 16px;
  padding-bottom: 16px;
  justify-content: space-between;
`;

interface ItemsCardProps {
  items:
    | Array<{ label: string; value: string | number | ReactNode }>
    | undefined;
  isDynamic?: boolean;
  isLoading?: boolean;
}

const ItemsCard: React.FC<ItemsCardProps> = ({
  items,
  isDynamic = false,
  isLoading = false,
}) => {
  return (
    <Card>
      {isLoading && <LoadingSpinner background={false} isLoading={isLoading} />}
      {items &&
        items.map((item, index) => (
          <>
            <CardContent key={index}>
              <Text fontVariant="bodyMedium">{item.label}</Text>
              <Text fontVariant="buttonMedium">{item.value}</Text>
            </CardContent>
            {index !== items.length - 1 && <CardHorizontalDivider />}
          </>
        ))}
    </Card>
  );
};

export default ItemsCard;
