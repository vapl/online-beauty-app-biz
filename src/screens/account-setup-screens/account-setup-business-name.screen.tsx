import React, { useContext, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import {
  AccountSetupBusinessNameScreenProps,
  AccountSetupBusinessNameScreenNavigationProp,
} from "../../types/navigationTypes";
import styled, { useTheme } from "styled-components/native";
import Button from "../../components/button/button.component";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Input from "../../components/inputs/input.component";
import Text from "../../components/text.component";
import StatusNav from "../../components/status-navbar.component";
import { UserContext } from "../../context/UserProvider";
import { BusinessContext } from "../../context/BusinessProvider";
import {
  getBusinessInfo,
  updateBusinessInfo,
} from "../../services/businessService";
import { handleError } from "../../utils/errorHandler";
import LoadingSpinner from "../../components/loading-spinner.component";

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

const EmailInput = styled(Input)``;
const PasswordInput = styled(Input)``;

const AccountSetupBusinessNameScreen: React.FC<
  AccountSetupBusinessNameScreenProps
> = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation =
    useNavigation<AccountSetupBusinessNameScreenNavigationProp>();
  const [businessName, setBusinessName] = useState<string>("");
  const [webPage, setWebpage] = useState<string>("");
  const [businessNameError, setBusinessNameError] = useState<string>();
  const [webPageError, setWebPageError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentStep = 0;
  const totalSteps = 5;

  const userContext = useContext(UserContext);
  const businessContext = useContext(BusinessContext);
  if (!userContext) return;
  const { user } = userContext;

  if (!businessContext) return null;
  const { businessData } = businessContext;

  const validateWebPageName = (value: string) => {
    const regex = /^www\.[a-zA-Z0-9_-]+\.[a-zA-Z]{2,3}(\/[a-zA-Z0-9_-]+)*\/?$/;
    if (value && !regex.test(value)) {
      return t("invalid_web_page_value");
    }
  };

  useEffect(() => {
    if (businessData) {
      setBusinessName(businessData.businessName || "");
      setWebpage(businessData.website || "");
    }
  }, [businessData]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const webPageValidationError = validateWebPageName(webPage);
    setWebPageError(webPageValidationError);
    if (webPageValidationError) return;

    try {
      if (user) {
        await updateBusinessInfo(user.uid, {
          businessName: businessName,
          website: webPage,
        });
        navigation.navigate("AccountSetupServices");
      } else {
        throw new Error("User is not authenticated.");
      }
    } catch (error) {
      handleError(error, "Error updating business information: ");
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
            <Text fontVariant="h3">
              {t("account_setup_business_name_title")}
            </Text>
            <Text fontVariant="bodyMedium">
              {t("account_setup_business_name_description")}
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
                <EmailInput
                  value={businessName}
                  onChangeText={setBusinessName}
                  label={t("placeholder_business_name")}
                  iconLeft="briefcase-variant-outline"
                  autoCapitalize="sentences"
                  keyboardType="default"
                  textContentType="none"
                  errorMessage={businessNameError}
                  autoCorrect={false}
                  required
                  onSubmitEditing={() => handleSubmit()}
                  returnKeyType="next"
                />
                <PasswordInput
                  value={webPage}
                  onChangeText={setWebpage}
                  label={t("placeholder_homepage")}
                  iconLeft="web"
                  keyboardType="default"
                  textContentType="none"
                  errorMessage={webPageError}
                  autoCorrect={true}
                  required
                  onSubmitEditing={() => handleSubmit()}
                  returnKeyType="done"
                />
              </InputWrapper>
            </KeyboardAvoidingView>
          </ScrollView>
          <View>
            <Button
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

export default AccountSetupBusinessNameScreen;
