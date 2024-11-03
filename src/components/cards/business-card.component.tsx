import React, { useState } from "react";
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
  padding: 8px;
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
  justify-content: space-between;
`;

interface BusinessCardProps {
  businessName?: string;
  regNumber?: string;
  address?: string;
  phone?: string;
  email?: string;
  isLoading?: boolean;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  businessName = "n/a",
  regNumber = "n/a",
  address = "n/a",
  phone = "n/a",
  email = "n/a",
  isLoading = false,
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      {isLoading && <LoadingSpinner background={false} isLoading={isLoading} />}
      <CardContent>
        <Text fontVariant="buttonMedium">
          {t("company_info_business_name")}
        </Text>
        <Text fontVariant="buttonMedium">
          {t("company_info_registration_number")}
        </Text>
      </CardContent>
      <CardHorizontalDivider />
      <CardContent>
        <Text fontVariant="bodyMedium">{businessName}</Text>
        <Text fontVariant="bodyMedium">{regNumber}</Text>
      </CardContent>
      <Space height={8} />
      <CardContent>
        <Text fontVariant="buttonMedium">Juridiskā adrese</Text>
      </CardContent>
      <CardHorizontalDivider />
      <CardContent>
        <Text fontVariant="bodyMedium">{address}</Text>
      </CardContent>
      <Space height={16} />
      <CardContent>
        <Text fontVariant="buttonMedium">Tālrunis</Text>
        <Text fontVariant="buttonMedium">E-pasts</Text>
      </CardContent>
      <CardHorizontalDivider />
      <CardContent>
        <Text fontVariant="bodyMedium">{phone}</Text>
        <Text fontVariant="bodyMedium">{email}</Text>
      </CardContent>
    </Card>
  );
};
