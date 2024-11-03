import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import {
  BusinessInfoScreenProps,
  BusinessProfileStatusNavigationProp,
} from "../../types/navigationTypes";
import styled, { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Input from "../../components/inputs/input.component";
import Text from "../../components/text.component";
import { UserContext } from "../../context/UserProvider";
import { BusinessContext } from "../../context/BusinessProvider";
import Space from "../../components/spacer.component";
import ListItem from "../../components/button/list-item.component";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "../../components/button/button.component";
import { Location } from "../../types/firestore-types/locationTypes";
import { getLocations } from "../../services/business/locationService";
import CustomModal from "../../components/modals/custom-modal.component";
import {
  Business,
  LegalAddress,
} from "../../types/firestore-types/businessTypes";
import { isEmpty } from "../../utils/validationUtils";
import { parsePhoneNumber } from "libphonenumber-js";
import { isPhoneNumberExists } from "../../services/auth/registerUser";
import { handleError } from "../../utils/errorHandler";
import { updateBusinessInfo } from "../../services/business/businessService";
import LoadingSpinner from "../../components/loading-spinner.component";
import showToast from "../../utils/toastConfig";
import isEqual from "lodash.isequal";
import { BusinessCard } from "../../components/cards/business-card.component";
import SectionHeader from "../../components/section-header.component";
import ItemsCard from "../../components/cards/items-card.component";
import LegalInfoEditModal from "../../components/modals/business-info-screen/legal-info-edit-modal.component";
import ServicesEditModal from "../../components/modals/business-info-screen/services-edit-modal.component";

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
`;

const MultilineInputWrapper = styled(View)``;

const BusinessInfoScreen: React.FC<BusinessInfoScreenProps> = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<BusinessProfileStatusNavigationProp>();
  const userContext = useContext(UserContext);
  const businessContext = useContext(BusinessContext);
  const [addressValue, setAddressValue] = useState<string>("n/a");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [textInputCounter, settextInputCounter] = useState<number>(0);
  const [isFocused, setIsfocused] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string | undefined>(undefined);
  const inputRef = useRef(null);

  if (!businessContext || !userContext) return null;
  let { businessData, totalSelections, completedSelections, locationData } =
    businessContext;
  const { user, userProfile } = userContext;

  const defaultLegalAddress: LegalAddress = {
    address: "",
    appartment: "",
    city: "",
    postalCode: "",
    country: "",
    region: "",
  };

  const [initialLegalInformation, setInitialLegalInformation] = useState<
    Partial<Business>
  >({});
  const [initialBusinessDescription, setInitialBusinessDescription] =
    useState<string>("");
  const [legalInformation, setLegalInformation] = useState<Partial<Business>>({
    businessName: businessData?.businessName ?? "",
    legalRegistrationNumber: businessData?.legalRegistrationNumber ?? "",
    legalAddress: { ...defaultLegalAddress, ...businessData?.legalAddress },
    phone: businessData?.phone ?? "",
    email: businessData?.email ?? "",
  });
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  const [isLoadingLegalInfo, setIsLoadingLegalInfo] = useState<boolean>(false);
  const [isLoadingDescription, setIsLoadingDescription] =
    useState<boolean>(false);
  const [callingCode, setCallingCode] = useState<string>("371");
  const [multilineInputValue, setMultilineInputValue] = useState<string>("");
  const [isServiceModalVisible, setIsServiceModalVisible] =
    useState<boolean>(false);
  let multilineInputLength = 600;

  useEffect(() => {
    callingCode;
  }, []);

  useEffect(() => {
    if (!businessData?.businessDescription) return;
    setInitialBusinessDescription(businessData?.businessDescription);
    setMultilineInputValue(businessData?.businessDescription);
  }, []);

  useEffect(() => {
    const handleLegalAddressValue = () => {
      if (businessData?.legalAddress?.address) {
        setAddressValue(
          `${businessData.legalAddress.address}${
            businessData.legalAddress.appartment
              ? "-" + businessData.legalAddress.appartment
              : ""
          }, ${businessData.legalAddress.city}, ${
            businessData.legalAddress.region
          }, ${businessData.legalAddress.country}, ${
            businessData.legalAddress.postalCode
          }`
        );
      } else {
        setAddressValue("n/a");
      }
    };
    handleLegalAddressValue();
  }, [businessData?.legalAddress]);

  const handlePhoneChange = async (text: string) => {
    setLegalInformation((prevInfo) => ({
      ...prevInfo,
      phone: text,
    }));

    const phoneValidationError = isEmpty(text, t("phone_required"));
    setPhoneError(phoneValidationError);

    if (!phoneValidationError) {
      try {
        const phoneNumber = parsePhoneNumber(text, {
          defaultCallingCode: callingCode,
        });

        if (phoneNumber && phoneNumber?.isPossible()) {
          const phoneExists = await isPhoneNumberExists(
            `+${legalInformation.phone}`
          );

          if (phoneExists) {
            setPhoneError(t("phone_already_in_use"));
          } else {
            setPhoneError(undefined);
          }
        } else {
          return setPhoneError(t("invalid_phone"));
        }
      } catch (error) {
        handleError(error, "Failed to parse phone number"),
          setPhoneError(t("invalid_phone"));
      }
    }
  };

  const submitEditedBusinessData = async (updatedValues: Partial<Business>) => {
    if (!user) return;
    setModalVisible(false);
    setIsLoadingLegalInfo(true);
    try {
      await updateBusinessInfo(user?.uid, updatedValues);
    } catch (error) {
      handleError(error, "Error updating business data.");
      setLegalInformation(updatedValues);
    } finally {
      setIsLoadingLegalInfo(false);
      showToast({
        message: t("legal_info_update_success_message"),
        type: "success",
      });
    }
  };

  const submitEditedDescription = async () => {
    if (!user || multilineInputValue === initialBusinessDescription) return;
    setIsLoadingDescription(true);
    try {
      const updateDescription = {
        ...legalInformation,
        businessDescription: multilineInputValue,
      };
      await updateBusinessInfo(user.uid, updateDescription);
      setInitialBusinessDescription(multilineInputValue);
    } catch (error) {
      handleError(error, "Error submitting descripton text");
    } finally {
      setIsLoadingDescription(false);
    }
  };

  return (
    <Background>
      <SafeArea>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 32 : 32}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <ScreenContainer>
              <Space height={0} />
              <Header>
                <Text fontVariant="bodyMedium">
                  {t("business_info_description")}
                </Text>
              </Header>
              <Space height={32} />
              <SectionHeader
                title={t("legal_info_title")}
                buttonColor={theme.colors.secondary.dark}
                button={
                  userProfile?.role === "owner" || userProfile?.role === "admin"
                }
                onPress={() => setModalVisible(true)}
              />
              <BusinessCard
                isLoading={isLoadingLegalInfo}
                businessName={businessData?.businessName}
                regNumber={businessData?.legalRegistrationNumber}
                address={addressValue}
                phone={businessData?.phone}
                email={businessData?.email}
              />
              <Space height={16} />
              <MultilineInputWrapper>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <Text fontVariant="bodySmall" textAlign="right">
                    {textInputCounter}/{multilineInputLength}
                  </Text>
                </View>
                <LoadingSpinner
                  isLoading={isLoadingDescription}
                  background={false}
                />
                <Input
                  value={multilineInputValue}
                  disabled={
                    userProfile?.role !== "owner" &&
                    userProfile?.role !== "admin"
                      ? true
                      : false
                  }
                  editable={false}
                  enableEditIcon={true}
                  multiline={true}
                  inputMode="text"
                  borderRadius={8}
                  numberOfLines={6}
                  maxLength={multilineInputLength}
                  label={t("placeholder_company_description")}
                  onChangeText={(text) => {
                    settextInputCounter(text.length);
                    if (text.length >= multilineInputLength) {
                      setInputError(t("input_length_limit"));
                    }
                    setInputError("");
                    setMultilineInputValue(text);
                  }}
                  onFocus={() => {
                    setIsfocused(true);
                  }}
                  onBlur={() => {
                    setIsfocused(false);
                  }}
                  errorMessage={inputError}
                />
                <Space height={8} />
                {multilineInputValue !== initialBusinessDescription && (
                  <Button
                    mode={"contained"}
                    label={t("button_save")}
                    buttonSize="sm"
                    onPress={() => {
                      submitEditedDescription();
                      setIsLoadingDescription(true);
                      setIsfocused(false);
                      Keyboard.dismiss();
                    }}
                  />
                )}
              </MultilineInputWrapper>
              <Space height={32} />
              <SectionHeader
                title={t("service_types")}
                buttonColor={theme.colors.secondary.dark}
                button={
                  userProfile?.role === "owner" || userProfile?.role === "admin"
                }
                onPress={() => setIsServiceModalVisible(true)}
              />
              <ItemsCard
                items={businessData?.services?.map((item, index) => ({
                  label: item,
                  value: index === 0 ? "Galvenā" : "",
                }))}
              />
              <Space height={32} />
              <SectionHeader
                title={t("tax_settings")}
                buttonColor={theme.colors.secondary.dark}
                button={
                  userProfile?.role === "owner" || userProfile?.role === "admin"
                }
                onPress={() => setModalVisible(true)}
              />
              <ItemsCard
                items={[
                  {
                    label: t("services"),
                    value: "21%",
                  },
                ]}
              />
              <Space height={32} />
              <SectionHeader
                title={t("invoice_numbering_settings")}
                buttonColor={theme.colors.secondary.dark}
                button={
                  userProfile?.role === "owner" || userProfile?.role === "admin"
                }
                onPress={() => setModalVisible(true)}
              />
              <ItemsCard
                items={[
                  {
                    label: t("invoice_prefix"),
                    value: "-",
                  },
                  {
                    label: t("invoice_sequential_number"),
                    value: "1",
                  },
                ]}
              />
            </ScreenContainer>
          </ScrollView>
        </KeyboardAvoidingView>
        {/* Business legal info edit modal */}
        <LegalInfoEditModal
          isVisible={modalVisible}
          initialValues={{
            businessName: businessData?.businessName || "",
            legalRegistrationNumber:
              businessData?.legalRegistrationNumber || "",
            legalAddress: {
              address: businessData?.legalAddress?.address || "",
              appartment: businessData?.legalAddress?.appartment || "",
              city: businessData?.legalAddress?.city || "",
              region: businessData?.legalAddress?.region || "",
              country: businessData?.legalAddress?.country || "",
              postalCode: businessData?.legalAddress?.postalCode || "",
            },
            phone: businessData?.phone || "",
            email: businessData?.email || "",
          }}
          onSave={submitEditedBusinessData}
          onClose={() => setModalVisible(false)}
        />
        {/* Services types edit modal */}
        <ServicesEditModal
          isVisible={isServiceModalVisible}
          onClose={() => setIsServiceModalVisible(false)}
        />
      </SafeArea>
    </Background>
  );
};

export default BusinessInfoScreen;
