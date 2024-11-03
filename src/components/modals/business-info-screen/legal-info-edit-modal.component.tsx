import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import styled, { useTheme } from "styled-components/native";
import CustomModal from "../custom-modal.component";
import Input from "../../inputs/input.component";
import Space from "../../spacer.component";
import Button from "../../button/button.component";
import { useTranslation } from "react-i18next";
import { isEqual } from "lodash";

const ModalContainer = styled(View)`
  flex: 1;
  justify-content: space-between;
  padding-bottom: ${(props) => props.theme.space.md}px;
`;

const ModalButtonWrapper = styled(View)`
  flex-direction: row;
  gap: ${(props) => props.theme.space.md}px;
  margin-top: ${(props) => props.theme.space.md}px;
`;

const ModalInputWrapper = styled(View)`
  gap: ${(props) => props.theme.space.md}px;
`;

interface LegalInfoProps {
  isVisible?: boolean;
  initialValues: {
    businessName: string;
    legalRegistrationNumber: string;
    legalAddress: {
      address: string;
      appartment: string;
      city: string;
      region: string;
      country: string;
      postalCode: string;
    };
    phone: string;
    email: string;
  };
  onSave: (updatedValues: any) => void;
  onClose: () => void;
}

const LegalInfoEditModal: React.FC<LegalInfoProps> = ({
  isVisible = false,
  initialValues,
  onSave,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Separate state for each input field
  const [businessName, setBusinessName] = useState(initialValues.businessName);
  const [legalRegistrationNumber, setLegalRegistrationNumber] = useState(
    initialValues.legalRegistrationNumber
  );
  const [legalAddress, setLegalAddress] = useState(initialValues.legalAddress);
  const [phone, setPhone] = useState(initialValues.phone);
  const [email, setEmail] = useState(initialValues.email);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    // Check if any field is modified compared to the initial values
    const isModified =
      businessName !== initialValues.businessName ||
      legalRegistrationNumber !== initialValues.legalRegistrationNumber ||
      phone !== initialValues.phone ||
      email !== initialValues.email ||
      !isEqual(legalAddress, initialValues.legalAddress);

    setIsSaveDisabled(!isModified);
  }, [businessName, legalRegistrationNumber, phone, email, legalAddress]);

  // Function to handle saving data
  const handleSave = () => {
    const updatedValues = {
      businessName,
      legalRegistrationNumber,
      legalAddress,
      phone,
      email,
    };
    onSave(updatedValues);
    onClose(); // Close the modal after saving
  };

  const handleLegalAddressChange = (
    field: keyof typeof legalAddress,
    value: string
  ) => {
    setLegalAddress((prevAddress) => ({
      ...prevAddress,
      [field]: value,
    }));
  };

  return (
    <CustomModal
      visible={isVisible}
      title={t("edit_legal_data")}
      onClose={onClose}
      isStatic={true}
      initialModalHeight={0.95}
    >
      <ModalContainer>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: theme.space.lg,
            flexGrow: 1,
            justifyContent: "flex-start",
          }}
        >
          <ModalInputWrapper>
            <Input
              value={businessName}
              label={t("placeholder_business_name")}
              onChangeText={setBusinessName}
              autoCapitalize="sentences"
            />
            <Input
              value={legalRegistrationNumber}
              label={t("label_business_legal_reg_number")}
              onChangeText={setLegalRegistrationNumber}
              autoCapitalize="sentences"
            />
            <Input
              value={legalAddress.address}
              label={t("business_address")}
              onChangeText={(text) => handleLegalAddressChange("address", text)}
              autoCapitalize="sentences"
            />
            <Input
              value={legalAddress.appartment}
              label={t("label_appartment")}
              onChangeText={(text) =>
                handleLegalAddressChange("appartment", text)
              }
              autoCapitalize="sentences"
            />
            <Input
              value={legalAddress.city}
              label={t("label_city")}
              onChangeText={(text) => handleLegalAddressChange("city", text)}
              autoCapitalize="sentences"
            />
            <Input
              value={legalAddress.region}
              label={t("label_parish")}
              onChangeText={(text) => handleLegalAddressChange("region", text)}
              autoCapitalize="sentences"
            />
            <Input
              value={legalAddress.country}
              label={t("label_country")}
              onChangeText={(text) => handleLegalAddressChange("country", text)}
              autoCapitalize="sentences"
            />
            <Input
              value={legalAddress.postalCode}
              label={t("label_postal_code")}
              onChangeText={(text) =>
                handleLegalAddressChange("postalCode", text)
              }
              autoCapitalize="sentences"
            />
            <Space height={8} />
            <Input
              value={phone}
              label={t("phone_input")}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              countryCodePicker={true}
              autoCapitalize="none"
            />
            <Input
              value={email}
              label={t("email")}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
            />
          </ModalInputWrapper>
        </ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 130 : 0}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <ModalButtonWrapper>
            <Button
              mode={"outlined"}
              label={t("button_cancel")}
              onPress={onClose}
            />
            <Button
              mode={"contained"}
              label={t("button_save")}
              onPress={handleSave}
              disabled={isSaveDisabled}
            />
          </ModalButtonWrapper>
        </KeyboardAvoidingView>
      </ModalContainer>
    </CustomModal>
  );
};

export default LegalInfoEditModal;
