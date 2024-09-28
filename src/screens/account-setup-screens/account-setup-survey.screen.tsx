import React, { useContext, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import {
  AccountSetupSurveyScreenProps,
  AccountSetupSurveyNavigationProp,
} from "../../types/navigationTypes";
import styled from "styled-components/native";
import Button from "../../components/button/button.component";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../context/UserProvider";
import { BusinessContext } from "../../context/BusinessProvider";
import Text from "../../components/text.component";
import StatusNav from "../../components/status-navbar.component";
import LoadingSpinner from "../../components/loading-spinner.component";
import Input from "../../components/inputs/input.component";
import { createSurveyData } from "../../services/surveyServices";

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
  justify-content: flex-start;
`;

const Header = styled(View)`
  justify-self: flex-start;
  gap: ${(props) => props.theme.space.sm}px;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
  margin-bottom: ${(props) => props.theme.space.xxl}px;
`;

const SurveyWrapper = styled(View)`
  justify-content: flex-start;
  align-items: stretch;
  gap: ${(props) => props.theme.space.md}px;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
  /* flex: 1; */
`;

const FooterButtonWrapper = styled(View)`
  margin-top: ${(props) => props.theme.space.md}px;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
`;

const NextButton = styled(Button)``;

interface SurveyVariantsProps {
  value: number;
  variant: string;
}

const AccountSetupSurveyScreen: React.FC<
  AccountSetupSurveyScreenProps
> = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AccountSetupSurveyNavigationProp>();
  const [checkedValue, setCheckedValue] = useState<number | null>(null);
  const [customVariantInput, setCustomVariantInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentStep = 4;
  const totalSteps = 5;

  const userContext = useContext(UserContext);
  const businessContext = useContext(BusinessContext);
  if (!userContext || !businessContext) {
    return;
  }
  const { user } = userContext;

  const surveyVariants: SurveyVariantsProps[] = [
    {
      value: 1,
      variant: t("survey_variant_recomendation"),
    },
    {
      value: 2,
      variant: t("survey_variant_search_engine"),
    },
    {
      value: 3,
      variant: t("survey_variant_social"),
    },
    {
      value: 4,
      variant: t("survey_variant_email"),
    },
    {
      value: 5,
      variant: t("survey_variant_magazine"),
    },
    {
      value: 6,
      variant: t("survey_variant_other"),
    },
  ];

  // useEffect(() => {
  //   surveyVariants.forEach((variant) => {
  //     if (
  //       businessInfo?.userFeedback?.response &&
  //       businessInfo?.userFeedback?.response === variant.variant
  //     ) {
  //       setCheckedValue(variant.value);
  //     }
  //   });
  // }, [businessInfo]);

  const handleSelection = (value: number) => {
    setCheckedValue(value);
    if (checkedValue !== 6) setCustomVariantInput("");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const selectedVariant = surveyVariants.find(
        (variant) => variant.value === checkedValue
      );
      if (user && user.uid) {
        // Prepare data for update
        const surveyData = {
          userId: user.uid,
          question: t("survey_title"),
          response:
            selectedVariant?.value === 6
              ? customVariantInput
              : selectedVariant?.variant,
        };

        await createSurveyData(surveyData);
      } else {
        console.error("User ID is missing or user is not authenticated");
      }
    } catch (error) {
      console.error("Faild to update survey", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Background>
      <SafeArea>
        <ScreenContainer>
          <StatusNav currentStep={currentStep} totalSteps={totalSteps} />
          <Header>
            <Text fontVariant="h3">{t("survey_title")}</Text>
          </Header>
          {isLoading && <LoadingSpinner />}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 130 : 0}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "flex-start",
              }}
            >
              <SurveyWrapper>
                {surveyVariants.map((variant) => {
                  return (
                    <Button
                      key={variant.value}
                      label={variant.variant}
                      mode={"radio"}
                      disabled={false}
                      status={
                        checkedValue === variant.value ? "checked" : "unchecked"
                      }
                      onPress={() => handleSelection(variant.value)}
                    />
                  );
                })}
                {checkedValue === 6 && (
                  <Input
                    value={customVariantInput}
                    onChangeText={setCustomVariantInput}
                    label={t("survey_variant_custom_label")}
                    iconLeft="pencil"
                    keyboardType="default"
                    textContentType="none"
                    autoCorrect={true}
                    autoFocus={checkedValue === 6}
                    required
                    onSubmitEditing={() => handleSubmit()}
                    returnKeyType="done"
                  />
                )}
              </SurveyWrapper>
            </ScrollView>
          </KeyboardAvoidingView>
        </ScreenContainer>
        <FooterButtonWrapper>
          <NextButton
            label={t("button_text_done")}
            mode="contained"
            onPress={handleSubmit}
          />
        </FooterButtonWrapper>
      </SafeArea>
    </Background>
  );
};

export default AccountSetupSurveyScreen;
