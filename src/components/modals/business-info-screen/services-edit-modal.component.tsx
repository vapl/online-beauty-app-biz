import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import styled, { useTheme } from "styled-components/native";
import Input from "../../inputs/input.component";
import ServiceCard from "../../service-card.component";
import { handleError } from "../../../utils/errorHandler";
import { updateBusinessInfo } from "../../../services/business/businessService";
import { getBeautyServices } from "../../../../data/beautyServices";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../../context/UserProvider";
import { BusinessContext } from "../../../context/BusinessProvider";
import CustomModal from "../custom-modal.component";
import Button from "../../button/button.component";
import { isEqual } from "lodash";

const InputWrapper = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: ${(props) => props.theme.space.sm}px;
`;

const ModalContainer = styled(View)`
  flex: 1;
  justify-content: space-between;
  padding-bottom: ${(props) => props.theme.space.md}px;
`;

const CustomServiceInput = styled(Input)``;

const ModalButtonWrapper = styled(View)`
  flex-direction: row;
  gap: ${(props) => props.theme.space.md}px;
  margin-top: ${(props) => props.theme.space.md}px;
`;

interface ServicesModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const ServicesEditModal: React.FC<ServicesModalProps> = ({
  isVisible,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [customServiceInput, setCustomServiceInput] = useState<string>("");
  const [showCustomServiceInput, setShowCustomServiceInput] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const services = getBeautyServices(t);
  const [initialSelectedServices, setInitialSelectedServices] = useState<
    number[] | null
  >(null);

  const userContext = useContext(UserContext);
  const businessContext = useContext(BusinessContext);
  if (!userContext || !businessContext) return null;

  const { user } = userContext;
  const { businessData } = businessContext;

  // Load initial selected services from the database on first render
  useEffect(() => {
    if (initialSelectedServices === null && businessData?.services) {
      const savedServices: number[] = businessData.services
        .map((service) => {
          const foundService = services.find((s) => s.label === service);
          return foundService ? foundService.key : -1;
        })
        .filter((key) => key !== -1);

      setInitialSelectedServices(savedServices); // Set the initial services from DB
      setSelectedServices(savedServices); // Set selected services initially
    }
  }, [businessData, services, initialSelectedServices]);

  // Reset state when the modal becomes visible
  useEffect(() => {
    if (isVisible && initialSelectedServices) {
      setSelectedServices(initialSelectedServices);
      setCustomServiceInput("");
      setIsSaveDisabled(true);
    }
  }, [isVisible, initialSelectedServices]);

  // Enable save button only if there are changes
  useEffect(() => {
    if (initialSelectedServices) {
      const isModified =
        !isEqual(selectedServices, initialSelectedServices) ||
        customServiceInput.length > 0;
      setIsSaveDisabled(!isModified);
    }
  }, [selectedServices, customServiceInput, initialSelectedServices]);

  const getChoiceStatus = (serviceKey: number) => {
    const index = selectedServices.indexOf(serviceKey);
    return index === -1 ? "" : (index + 1).toString();
  };

  const toggleServiceSelection = (serviceKey: number) => {
    if (selectedServices.length >= 4 && !selectedServices.includes(serviceKey))
      return;

    const updatedServices = selectedServices.includes(serviceKey)
      ? selectedServices.filter((key) => key !== serviceKey)
      : [...selectedServices, serviceKey];

    setSelectedServices(updatedServices);

    const isCustomSelected = updatedServices.some(
      (key) =>
        services.find((service) => service.key === key)?.label ===
        t("services_other")
    );

    setShowCustomServiceInput(isCustomSelected);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const selectedServiceLabels = selectedServices.map((serviceKey) => {
        const service = services.find((s) => s.key === serviceKey);
        return service ? service.label : "";
      });

      if (user) {
        await updateBusinessInfo(user.uid, {
          services: selectedServiceLabels,
        });
        setInitialSelectedServices(selectedServices); // Update initial state after saving
      }
    } catch (error) {
      handleError(error, "Failed to update services");
    } finally {
      setIsLoading(false);
      onClose(); // Close the modal after save
    }
  };

  return (
    <CustomModal
      visible={isVisible}
      title={t("service_types")}
      onClose={onClose}
      isStatic={true}
      initialModalHeight={0.95}
    >
      <ModalContainer>
        <ScrollView
          automaticallyAdjustKeyboardInsets
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "center",
            paddingBottom: 0,
            flexGrow: 1,
          }}
        >
          <InputWrapper>
            {services.map((service) => (
              <ServiceCard
                key={service.key}
                choiceStatus={getChoiceStatus(service.key)}
                icon={service.icon}
                label={service.label}
                selected={selectedServices.includes(service.key)}
                isMainService={selectedServices[0] === service.key}
                onPress={() => toggleServiceSelection(service.key)}
              />
            ))}
            {showCustomServiceInput && (
              <CustomServiceInput
                value={customServiceInput}
                onChangeText={setCustomServiceInput}
                label={t("custom_service_input_label")}
                iconLeft="card-plus-outline"
                keyboardType="default"
                textContentType="none"
                autoCorrect={true}
                required
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
              />
            )}
          </InputWrapper>
        </ScrollView>
        <ModalButtonWrapper>
          <Button
            mode={"outlined"}
            label={t("button_cancel")}
            onPress={onClose}
          />
          <Button
            mode={"contained"}
            label={t("button_save")}
            onPress={handleSubmit}
            disabled={isSaveDisabled}
          />
        </ModalButtonWrapper>
      </ModalContainer>
    </CustomModal>
  );
};

export default ServicesEditModal;
