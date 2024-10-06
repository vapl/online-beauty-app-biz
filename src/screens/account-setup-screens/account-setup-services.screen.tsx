import React, { useContext, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import {
  AccountSetupServicesScreenProps,
  AccountSetupServicesScreenNavigationProp,
} from "../../types/navigationTypes";
import styled, { useTheme } from "styled-components/native";
import Button from "../../components/button/button.component";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Input from "../../components/inputs/input.component";
import Text from "../../components/text.component";
import StatusNav from "../../components/status-navbar.component";
import ServiceCard from "../../components/service-card.component";
import { getBeautyServices } from "../../../data/beautyServices";
import { UserContext } from "../../context/UserProvider";
import { updateBusinessInfo } from "../../services/businessService";
import { BusinessContext } from "../../context/BusinessProvider";
import LoadingSpinner from "../../components/loading-spinner.component";
import { handleError } from "../../utils/errorHandler";

const SafeArea = styled(SafeAreaView)`
  flex: 1;
  margin-top: ${StatusBar.currentHeight}px;
`;

const Background = styled(View)`
  background-color: ${(props) => props.theme.colors.background};
  flex: 1;
`;

const ScreenContainer = styled(View)`
  flex: 1;
  justify-content: space-between;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
`;

const Header = styled(View)`
  justify-content: flex-start;
  gap: ${(props) => props.theme.space.sm}px;
  margin-bottom: 20px;
`;

const InputWrapper = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: ${(props) => props.theme.space.sm}px;
`;

const CustomServiceInput = styled(Input)``;
const NextButton = styled(Button)``;

const Footer = styled(View)`
  margin-top: 20px;
`;

const AccountSetupServicesScreen: React.FC<
  AccountSetupServicesScreenProps
> = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<AccountSetupServicesScreenNavigationProp>();
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [customServiceInput, setCustomServiceInput] = useState<string>("");
  const [showCustomServiceInput, setShowCustomServiceInput] =
    useState<boolean>(false);
  const [isLoadedFromDB, setIsLoadedFromDB] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const services = getBeautyServices(t);

  const userContext = useContext(UserContext);
  const businessContext = useContext(BusinessContext);
  if (!userContext) return;
  if (!businessContext) return;
  const { user } = userContext;
  const { businessData } = businessContext;
  const currentStep = 1;
  const totalSteps = 5;

  useEffect(() => {
    if (!businessData?.services || !services || isLoadedFromDB) return;

    // Izveido masīvu ar indeksiem, kas atbilst pakalpojumu atslēgām
    const savedServices: number[] = businessData.services
      .map((service) => {
        const foundService = services.find((s) => s.label === service);
        return foundService ? foundService.key : -1; // Atgriež `key` vai -1, ja pakalpojums nav atrasts
      })
      .filter((key) => key !== -1); // Noņem `-1` vērtības (ja pakalpojumi nav atrasti)

    // Iestata izvēlētos pakalpojumus tikai pirmo reizi
    setSelectedServices(savedServices);
    setIsLoadedFromDB(true); // Iestatām, ka pakalpojumi ir ielādēti
  }, [businessData, services, isLoadedFromDB]);

  const getChoiceStatus = (serviceKey: number) => {
    const index = selectedServices.indexOf(serviceKey);
    return index === -1 ? "" : (index + 1).toString();
  };

  const toggleServiceSelection = (serviceKey: number) => {
    if (selectedServices.length >= 4 && !selectedServices.includes(serviceKey))
      return;

    let updatedServices: number[];

    if (selectedServices.includes(serviceKey)) {
      updatedServices = selectedServices.filter((key) => key !== serviceKey);
    } else {
      updatedServices = [...selectedServices, serviceKey];
    }

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
        navigation.navigate("AccountSetupTeam");
      }
    } catch (error) {
      handleError(error, "Failed to update services");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Background>
      <SafeArea>
        {isLoading && <LoadingSpinner />}
        <ScreenContainer>
          <StatusNav currentStep={currentStep} totalSteps={totalSteps} />
          <Header>
            <Text fontVariant="h3">{t("account_setup_services_title")}</Text>
            <Text fontVariant="bodyMedium">
              {t("account_setup_services_description")}
            </Text>
          </Header>
          <ScrollView
            automaticallyAdjustKeyboardInsets
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              justifyContent: "center",
              paddingBottom: 150,
              flexGrow: 1,
            }}
          >
            <KeyboardAvoidingView contentContainerStyle={{ flexGrow: 1 }}>
              <InputWrapper>
                {services.map((service) => (
                  <ServiceCard
                    key={service.key}
                    choiceStatus={getChoiceStatus(service.key)}
                    icon={service.icon}
                    label={service.label}
                    selected={selectedServices.includes(service.key)}
                    isMainService={selectedServices[0] === service.key}
                    onPress={() => {
                      toggleServiceSelection(service.key);
                    }}
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
                    onSubmitEditing={() => handleSubmit()}
                    returnKeyType="done"
                  />
                )}
              </InputWrapper>
            </KeyboardAvoidingView>
          </ScrollView>
          <Footer>
            <NextButton
              label={t("button_next")}
              mode="contained"
              onPress={handleSubmit}
              disabled={
                selectedServices.length < 1 ||
                (!customServiceInput && showCustomServiceInput)
              }
            />
          </Footer>
        </ScreenContainer>
      </SafeArea>
    </Background>
  );
};

export default AccountSetupServicesScreen;
