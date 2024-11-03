import React, { useContext, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import {
  AccountSetupLocationScreenProps,
  AccountSetupLocationScreenNavigationProp,
} from "../../types/navigationTypes";
import styled, { useTheme } from "styled-components/native";
import Button from "../../components/button/button.component";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../context/UserProvider";
import { BusinessContext } from "../../context/BusinessProvider";
import Text from "../../components/text.component";
import StatusNav from "../../components/status-navbar.component";
import CustomModal from "../../components/modals/custom-modal.component";
import { updateBusinessInfo } from "../../services/business/businessService";
import LocationInput from "../../components/inputs/location-input.component";
import LoadingSpinner from "../../components/loading-spinner.component";
import { Location } from "../../types/firestore-types/locationTypes";
import {
  getLocations,
  updateLocation,
} from "../../services/business/locationService";
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
`;

const InputWrapper = styled(View)`
  justify-content: center;
  align-items: stretch;
  gap: ${(props) => props.theme.space.sm}px;
`;

const NextButton = styled(Button)``;

const AccountSetupLocationScreen: React.FC<
  AccountSetupLocationScreenProps
> = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const navigation = useNavigation<AccountSetupLocationScreenNavigationProp>();
  const [location, setLocation] = useState<Location | undefined>(undefined);
  const [checked, setChecked] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentStep = 3;
  const totalSteps = 5;

  const userContext = useContext(UserContext);
  const businessContext = useContext(BusinessContext);
  if (!userContext || !businessContext) return;
  const { user, userProfile } = userContext;
  const { businessData } = businessContext;

  useEffect(() => {
    const setLocationData = async () => {
      if (!businessData?.businessId) return;
      try {
        const locationData = await getLocations(businessData?.businessId);

        if (locationData && locationData.length > 0) {
          const primaryLocation = locationData[0];
          setLocation({
            address: primaryLocation.address || "",
            city: primaryLocation.city || "",
            region: primaryLocation.region || "",
            country: primaryLocation.country || "",
            postalCode: primaryLocation.postalCode || "",
          });
        }
      } catch (error) {
        handleError(error, "Error fetching location data");
      }
    };
    if (user && businessData) {
      setLocationData();
    }
  }, [user, businessData]);

  const handleLocationSelect = (address: Location) => {
    setLocation(address);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (user) {
        if (!checked) {
          await updateBusinessInfo(user.uid, { onsiteService: checked });

          navigation.navigate("AccountSetupLocationConfirmation", {
            onsiteService: checked,
            location: location || undefined,
          });
        } else {
          if (location && businessData?.locations && userProfile?.businessId) {
            await updateLocation(
              userProfile?.businessId,
              businessData?.locations[0],
              location
            );
            navigation.navigate("AccountSetupSurvey");
          } else {
            console.error("User ID is missing or user is not authenticated");
          }
        }
      }
    } catch (error) {
      console.error("Failed to update business info", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Background>
      <SafeArea>
        <LoadingSpinner isLoading={isLoading} />
        <ScreenContainer>
          <StatusNav currentStep={currentStep} totalSteps={totalSteps} />
          <Header>
            <Text fontVariant="h3">{t("account_setup_location_title")}</Text>
            <Text fontVariant="bodyMedium">
              {t("account_setup_location_description")}
            </Text>
          </Header>
          <ScrollView
            automaticallyAdjustKeyboardInsets
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              justifyContent: "center",
              paddingBottom: 150,
              flex: 1,
            }}
          >
            <KeyboardAvoidingView contentContainerStyle={{ flexGrow: 1 }}>
              <InputWrapper>
                <Button
                  label={
                    location?.address ? location.address : t("label_address")
                  }
                  mode="outlined"
                  justifyContent="flex-start"
                  icon="map-marker-outline"
                  iconColor={
                    location?.address
                      ? theme.colors.primary.dark
                      : theme.colors.grey[60]
                  }
                  onPress={() => setModalVisible(true)}
                  labelStyle={theme.typography.bodyLarge}
                  labelColor={
                    location?.address
                      ? theme.colors.primary.dark
                      : theme.colors.grey[60]
                  }
                  disabled={checked}
                />
                <Text
                  onPress={() => setChecked((prev) => !prev)}
                  fontVariant="bodyMedium"
                  showCheckbox={true}
                  checked={checked}
                  textColor={theme.colors.grey[80]}
                  checkboxColor={theme.colors.primary.dark}
                  uncheckedColor={theme.colors.primary.dark}
                >
                  {t("no_location")}
                </Text>
              </InputWrapper>
            </KeyboardAvoidingView>
          </ScrollView>
          <CustomModal
            visible={modalVisible}
            title={t("title_find_location")}
            rightButtonLabel={t("label_add")}
            onClose={() => setModalVisible(false)}
            onPress={() => setModalVisible(false)}
            isStatic={true}
            initialModalHeight={0.95}
          >
            <LocationInput
              placeholder={t("label_address")}
              onPress={handleLocationSelect}
              language={language}
              country={language}
              autoFocus={modalVisible}
            />
          </CustomModal>
          <View>
            <NextButton
              label={t("button_next")}
              mode="contained"
              onPress={handleSubmit}
            />
          </View>
        </ScreenContainer>
      </SafeArea>
    </Background>
  );
};

export default AccountSetupLocationScreen;
