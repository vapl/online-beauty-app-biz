import React, { useContext, useEffect, useRef, useState } from "react";
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
  HomeTabsNavigationProp,
} from "../../types/navigationTypes";
import styled from "styled-components/native";
import Button from "../../components/button/button.component";
import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../context/UserProvider";
import { BusinessContext } from "../../context/BusinessProvider";
import Text from "../../components/text.component";
import StatusNav from "../../components/status-navbar.component";
import LoadingSpinner from "../../components/loading-spinner.component";
import Input from "../../components/inputs/input.component";
import { createSurveyData } from "../../services/surveyServices";
import SuccessModal from "../../components/modals/success-modal.component";
import { updateUser } from "../../services/userService";
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
  const navigation = useNavigation<HomeTabsNavigationProp>();
  const [checkedValue, setCheckedValue] = useState<number | null>(null);
  const [customVariantInput, setCustomVariantInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [timer, setTimer] = useState<number>(10);
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

  const handleSelection = (value: number) => {
    setCheckedValue(value);
    if (checkedValue !== 6) setCustomVariantInput("");
  };

  const handleUserUpdate = async () => {
    try {
      if (!user) {
        throw new Error("User is not authenticated.");
      }
      await updateUser(user.uid, { firstLogin: false });
      userContext.firstLogin = false;
    } catch (error) {
      handleError(error, "Failed to update user");
    }
  };

  const handleSuccess = () => {
    setTimer(10);
    setIsSuccess(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    timeoutRef.current = setTimeout(async () => {
      handleUserUpdate();

      setIsSuccess(false);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 10000);
  };

  const clearCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let hasError = false;
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
        hasError = true;
      }
    } catch (error) {
      console.error("Faild to update survey", error);
      hasError = true;
    } finally {
      setIsLoading(false);
      handleSuccess();
    }
  };

  return (
    <>
      <Background>
        <SuccessModal
          visible={isSuccess}
          messageTitle={t("success_modal_title")}
          messageDescription={t("success_modal_description")}
          buttonLabel={`${t("button_text_continue")} (${timer})`}
          onClose={() => {
            handleUserUpdate();
            clearCountdown();
            setIsSuccess(false);
          }}
        />
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
                          checkedValue === variant.value
                            ? "checked"
                            : "unchecked"
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
              disabled={!checkedValue}
            />
          </FooterButtonWrapper>
        </SafeArea>
      </Background>
    </>
  );
};

export default AccountSetupSurveyScreen;
