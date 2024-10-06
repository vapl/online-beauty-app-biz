import React, { useContext, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import {
  AccountSetupTeamScreenProps,
  AccountSetupTeamScreenNavigationProp,
} from "../../types/navigationTypes";
import styled, { useTheme } from "styled-components/native";
import Button from "../../components/button/button.component";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Text from "../../components/text.component";
import StatusNav from "../../components/status-navbar.component";
import { UserContext } from "../../context/UserProvider";
import { BusinessContext } from "../../context/BusinessProvider";
import { updateBusinessInfo } from "../../services/businessService";
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

const NextButton = styled(Button)``;
const RadioButton = styled(Button)``;

interface TeamVariantsProps {
  value: number;
  variant: string;
}

const AccountSetupTeamScreen: React.FC<AccountSetupTeamScreenProps> = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<AccountSetupTeamScreenNavigationProp>();
  const [checkedValue, setCheckedValue] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userContext = useContext(UserContext);
  const businessContext = useContext(BusinessContext);
  if (!userContext || !businessContext) return;
  const { user } = userContext;
  const { businessData } = businessContext;
  const currentStep = 2;
  const totalSteps = 5;

  const teamVariants: TeamVariantsProps[] = [
    {
      value: 1,
      variant: t("team_single"),
    },
    {
      value: 2,
      variant: "2-3 " + t("team_employees"),
    },
    {
      value: 3,
      variant: "4-6 " + t("team_employees"),
    },
    {
      value: 4,
      variant: "6+ " + t("team_employees"),
    },
  ];

  useEffect(() => {
    teamVariants.forEach((variant) => {
      if (businessData?.teamSize && businessData.teamSize === variant.variant) {
        setCheckedValue(variant.value);
      }
    });
  }, [businessData]);

  const handleSelection = (value: number) => {
    setCheckedValue(value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const selectedTeamSize = teamVariants.find(
        (variant) => variant.value === checkedValue
      );
      if (user) {
        await updateBusinessInfo(user.uid, {
          teamSize: selectedTeamSize?.variant,
        });
        navigation.navigate("AccountSetupLocation");
      }
    } catch (error) {
      handleError(error, "Failed to update team's lineup");
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
            <Text fontVariant="h3">{t("account_setup_team_title")}</Text>
            <Text fontVariant="bodyMedium">
              {t("account_setup_team_description")}
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
                {teamVariants.map((variant) => {
                  return (
                    <RadioButton
                      key={variant.value}
                      mode="radio"
                      value={variant.value}
                      label={variant.variant}
                      status={
                        checkedValue === variant.value ? "checked" : "unchecked"
                      }
                      onPress={() => handleSelection(variant.value)}
                      disabled={false}
                      justifyContent="flex-start"
                    />
                  );
                })}
              </InputWrapper>
            </KeyboardAvoidingView>
          </ScrollView>
          <View>
            <NextButton
              label={t("button_next")}
              mode="contained"
              onPress={handleSubmit}
              disabled={!checkedValue}
            />
          </View>
        </ScreenContainer>
      </SafeArea>
    </Background>
  );
};

export default AccountSetupTeamScreen;
