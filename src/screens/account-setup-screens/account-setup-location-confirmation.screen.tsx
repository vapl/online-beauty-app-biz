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
import StatusNav from "../../components/status-navbar";
import CustomModal from "../../components/modals/custom-modal.component";
import { updateBusinessInfo } from "../../services/businessService";
import Input from "../../components/inputs/input.component";
import MapView from "react-native-maps";
import LoadingSpinner from "../../components/loading.spinner";

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

interface LocationProps {
  address: string;
  city: string;
  parish: string;
  country: string;
  postalCode: string;
}

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
  const { hasLocation, address, city, parish, country, postalCode } =
    route.params || {};

  const [initialLocation, setInitialLocation] = useState<LocationProps>({
    address: address || "",
    city: city || "",
    parish: parish || "",
    country: country || "",
    postalCode: postalCode || "",
  });
  const [location, setLocation] = useState<LocationProps>(initialLocation);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const currentStep = 3;
  const totalSteps = 5;

  const userContext = useContext(UserContext);
  const businessContext = useContext(BusinessContext);
  if (!userContext || !businessContext) {
    return <LoadingSpinner />;
  }
  const { user } = userContext;

  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);

  const checkIfLocationChanged = () => {
    return (
      location.address !== initialLocation.address ||
      location.city !== initialLocation.city ||
      location.parish !== initialLocation.parish ||
      location.country !== initialLocation.country ||
      location.postalCode !== initialLocation.postalCode
    );
  };

  useEffect(() => {
    setIsSaveDisabled(!checkIfLocationChanged());
  }, [location, initialLocation]);

  useEffect(() => {
    if (modalVisible) {
      setInitialLocation(location);
    }
  }, [modalVisible, initialLocation]);

  const handleEditedLocation = useCallback(() => {
    navigation.navigate("AccountSetupLocationConfirmation", {
      hasLocation: true,
      ...location,
    });
    setModalVisible(false);
  }, [location, navigation]);

  const handleSubmit = async () => {
    try {
      if (user) {
        const locationData = !hasLocation
          ? {
              hasLocation: hasLocation,
              address: "",
              city: "",
              parish: "",
              country: "",
              postalCode: "",
            }
          : {
              hasLocation,
              ...location,
            };
        await updateBusinessInfo(user.uid, { location: locationData });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Background>
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
                  {address}, {city}
                </Text>
                <Text fontVariant="bodyMedium">LV-{postalCode}</Text>
                <Text fontVariant="bodyMedium">
                  {city}, {parish}
                </Text>
                <Text fontVariant="bodyMedium">{country}</Text>
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
                parish: "",
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
                    value={location.address}
                    label={t("label_address")}
                    onChangeText={(text) =>
                      setLocation({ ...location, address: text })
                    }
                    editable={true}
                    autoCapitalize="sentences"
                  />
                  <Input
                    value={location.parish}
                    onChangeText={(text) =>
                      setLocation({ ...location, parish: text })
                    }
                    editable={true}
                    autoCapitalize="sentences"
                    label={t("label_parish")}
                    textContentType="name"
                  />
                  <Input
                    value={location.city}
                    onChangeText={(text) =>
                      setLocation({ ...location, city: text })
                    }
                    editable={true}
                    autoCapitalize="sentences"
                    label={t("label_city")}
                    textContentType="name"
                  />
                  <Input
                    value={location.postalCode}
                    onChangeText={(text) =>
                      setLocation({ ...location, postalCode: text })
                    }
                    editable={true}
                    autoCapitalize="sentences"
                    label={t("label_postal_code")}
                    textContentType="name"
                  />
                  <Input
                    value={location.country}
                    onChangeText={(text) =>
                      setLocation({ ...location, country: text })
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
    </Background>
  );
};

export default AccountSetupLocationConfirmationScreen;
