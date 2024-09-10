import React, { useState } from "react";
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
import Input from "../../components/input.component";
import Text from "../../components/text.component";
import StatusNav from "../../components/status-navbar";
import { Checkbox } from "react-native-paper";

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

const LocationInput = styled(Input)``;
const PasswordInput = styled(Input)``;

const LoginButton = styled(Button)``;

const AccountSetupLocationScreen: React.FC<
  AccountSetupLocationScreenProps
> = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<AccountSetupLocationScreenNavigationProp>();
  const [businessName, setBusinessName] = useState<string>("");
  const [checked, setChecked] = useState<boolean>(false);
  const currentStep = 3;
  const totalSteps = 5;

  const handleCheckboxChange = () => {
    setChecked((prev) => !prev);
  };

  const handleSubmit = () => {
    return;
  };

  return (
    <Background>
      <SafeArea>
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
                <LocationInput
                  value={businessName}
                  onChangeText={setBusinessName}
                  label={t("address")}
                  iconLeft="map-marker-outline"
                  autoCapitalize="sentences"
                  keyboardType="default"
                  textContentType="none"
                  autoCorrect={false}
                  disabled={checked}
                  onSubmitEditing={() => handleSubmit()}
                  returnKeyType="next"
                />
                <Text
                  onPress={() => setChecked((prev) => !prev)}
                  onCheckboxChange={() => setChecked((prev) => !prev)}
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
          <View>
            <LoginButton
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
