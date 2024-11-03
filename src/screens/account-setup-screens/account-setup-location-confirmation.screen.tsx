import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import {
  AccountSetupLocationConfirmationScreenProps,
  AccountSetupLocationConfirmationScreenNavigationProp,
  RootStackParamList,
} from "../../types/navigationTypes";
import styled, { useTheme } from "styled-components/native";
import Button from "../../components/button/button.component";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../context/UserProvider";
import { BusinessContext } from "../../context/BusinessProvider";
import Text from "../../components/text.component";
import StatusNav from "../../components/status-navbar.component";
import CustomModal from "../../components/modals/custom-modal.component";
import Input from "../../components/inputs/input.component";
import MapView from "react-native-maps";
import LoadingSpinner from "../../components/loading-spinner.component";
import { Location } from "../../types/firestore-types/locationTypes";
import {
  addLocation,
  updateLocation,
} from "../../services/business/locationService";
import { BackgroundColor } from "../../components/background-color.component";
import { SafeArea } from "../../components/safe-area.component";

const ScreenContainer = styled(View)`
  flex: 1;
  justify-content: space-between;
`;

const Header = styled(View)`
  justify-content: flex-start;
  gap: ${(props) => props.theme.space.sm}px;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
  margin-bottom: ${(props) => props.theme.space.md}px;
`;

const TitleWrapper = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  height: 50px;
  align-items: flex-start;
`;

const AddressWrapper = styled(View)`
  justify-content: flex-end;
  align-items: stretch;
  gap: ${(props) => props.theme.space.xs}px;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
`;

const MapWrapper = styled(View)`
  margin-top: ${(props) => props.theme.space.xl}px;
  margin-bottom: ${(props) => props.theme.space.md}px;
  justify-content: flex-end;
  gap: ${(props) => props.theme.space.xs}px;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
`;

const StyledMapView = styled(MapView)`
  width: 100%;
  height: 400px;
`;

const ModalInputWrapper = styled(View)`
  gap: ${(props) => props.theme.space.md}px;
`;

const ModalContainer = styled(View)`
  flex: 1;
  justify-content: space-between;
  padding-bottom: ${(props) => props.theme.space.md}px;
`;

const FooterButtonWrapper = styled(View)`
  margin-top: ${(props) => props.theme.space.md}px;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
`;

const ModalButtonWrapper = styled(View)`
  flex-direction: row;
  gap: ${(props) => props.theme.space.md}px;
  margin-top: ${(props) => props.theme.space.md}px;
`;
const NextButton = styled(Button)``;

const AccountSetupLocationConfirmationScreen: React.FC<
  AccountSetupLocationConfirmationScreenProps
> = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation =
    useNavigation<AccountSetupLocationConfirmationScreenNavigationProp>();
  const route =
    useRoute<
      RouteProp<RootStackParamList, "AccountSetupLocationConfirmation">
    >();
  const { location: routeLocation, onsiteService } =
    (route.params as { location?: Location; onsiteService?: boolean }) || {};

  const [currentLocation, setCurrentLoaction] = useState<Location>({
    address: routeLocation?.address || "",
    city: routeLocation?.city || "",
    region: routeLocation?.region || "",
    country: routeLocation?.country || "",
    postalCode: routeLocation?.postalCode || "",
  });
  const [location, setLocation] = useState<Location>(currentLocation);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentStep = 3;
  const totalSteps = 5;

  const userContext = useContext(UserContext);
  const businessContext = useContext(BusinessContext);
  if (!userContext || !businessContext) {
    return;
  }
  const { user, userProfile } = userContext;
  const { businessData } = businessContext;

  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);

  const checkIfLocationChanged = () => {
    return (
      location.address !== currentLocation.address ||
      location.city !== currentLocation.city ||
      location.region !== currentLocation.region ||
      location.country !== currentLocation.country ||
      location.postalCode !== currentLocation.postalCode
    );
  };

  useEffect(() => {
    setIsSaveDisabled(!checkIfLocationChanged());
    if (!user) return;
  }, [location, currentLocation]);

  useEffect(() => {
    if (modalVisible) {
      setCurrentLoaction(location);
    }
  }, [modalVisible, currentLocation]);

  const handleEditedLocation = useCallback(() => {
    navigation.navigate("AccountSetupLocationConfirmation", {
      onsiteService: true,
      location: currentLocation,
    });
    setModalVisible(false);
  }, [currentLocation, navigation]);

  const handleSubmit = async () => {
    if (!user || !userProfile || !userProfile.businessId || !businessData) {
      return; // Iziet, ja businessData nav gatavs
    }
    setIsLoading(true);
    try {
      const locationData = businessData?.onsiteService
        ? {
            address: "",
            city: "",
            region: "",
            country: "",
            postalCode: "",
          }
        : {
            ...currentLocation,
          };
      const locationId = await addLocation(
        userProfile.businessId,
        locationData
      );
      if (locationId) {
        navigation.navigate("AccountSetupSurvey");
      }
    } catch (error) {
      console.error("Failed to update business info", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundColor>
      <SafeArea>
        <ScreenContainer>
          <StatusNav currentStep={currentStep} totalSteps={totalSteps} />
          <Header>
            <Text fontVariant="h3">
              {t("account_setup_location_confirmation_title")}
            </Text>
            <Text fontVariant="bodyMedium">
              {t("account_setup_location_confirmation_description")}
            </Text>
          </Header>
          <LoadingSpinner isLoading={isLoading} />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: theme.space.lg,
              flexGrow: 1,
              justifyContent: "flex-start",
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <AddressWrapper>
                <Text fontVariant="h5">{t("business_address")}</Text>
                <Text fontVariant="bodyMedium">
                  {location.address}, {location.city}
                </Text>
                <Text fontVariant="bodyMedium">LV-{location.postalCode}</Text>
                <Text fontVariant="bodyMedium">
                  {location.city}, {location.region}
                </Text>
                <Text fontVariant="bodyMedium">{location.country}</Text>
              </AddressWrapper>
              <MapWrapper>
                <TitleWrapper>
                  <Text fontVariant="h5">{t("address_on_map_title")}</Text>
                  <View>
                    <Button
                      mode={"text"}
                      label={t("edit")}
                      labelStyle={{
                        padding: 0,
                        margin: 0,
                        alignSelf: "flex-start",
                      }}
                      onPress={() => {
                        setModalVisible(true);
                      }}
                    />
                  </View>
                </TitleWrapper>
                <Text fontVariant="bodyMedium">
                  {t("address_on_map_description")}
                </Text>
              </MapWrapper>
              <StyledMapView />
            </KeyboardAvoidingView>
          </ScrollView>
          <CustomModal
            visible={modalVisible}
            title={t("account_setup_location_edit_title")}
            rightButtonLabel={t("text_clear")}
            onClose={() => setModalVisible(false)}
            onPress={() =>
              setLocation({
                ...location,
                address: "",
                city: "",
                region: "",
                country: "",
                postalCode: "",
              })
            }
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
                    value={currentLocation.address || ""}
                    label={t("label_address")}
                    onChangeText={(text) =>
                      setCurrentLoaction({ ...currentLocation, address: text })
                    }
                    editable={true}
                    autoCapitalize="sentences"
                  />
                  <Input
                    value={currentLocation.region || ""}
                    onChangeText={(text) =>
                      setCurrentLoaction({ ...currentLocation, region: text })
                    }
                    editable={true}
                    autoCapitalize="sentences"
                    label={t("label_parish")}
                    textContentType="name"
                  />
                  <Input
                    value={currentLocation.city || ""}
                    onChangeText={(text) =>
                      setCurrentLoaction({ ...currentLocation, city: text })
                    }
                    editable={true}
                    autoCapitalize="sentences"
                    label={t("label_city")}
                    textContentType="name"
                  />
                  <Input
                    value={currentLocation.postalCode || ""}
                    onChangeText={(text) =>
                      setCurrentLoaction({
                        ...currentLocation,
                        postalCode: text,
                      })
                    }
                    editable={true}
                    autoCapitalize="sentences"
                    label={t("label_postal_code")}
                    textContentType="name"
                  />
                  <Input
                    value={currentLocation.country || ""}
                    onChangeText={(text) =>
                      setCurrentLoaction({ ...currentLocation, country: text })
                    }
                    editable={true}
                    autoCapitalize="sentences"
                    label={t("label_country")}
                    textContentType="name"
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
                    onPress={() => setModalVisible(false)}
                  />
                  <Button
                    mode={"contained"}
                    label={t("button_save")}
                    onPress={handleEditedLocation}
                    disabled={isSaveDisabled}
                  />
                </ModalButtonWrapper>
              </KeyboardAvoidingView>
            </ModalContainer>
          </CustomModal>
          <FooterButtonWrapper>
            <NextButton
              label={t("button_next")}
              mode="contained"
              onPress={handleSubmit}
            />
          </FooterButtonWrapper>
        </ScreenContainer>
      </SafeArea>
    </BackgroundColor>
  );
};

export default AccountSetupLocationConfirmationScreen;
