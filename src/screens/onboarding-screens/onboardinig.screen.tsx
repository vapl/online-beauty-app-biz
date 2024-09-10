import React, { useEffect, useState } from "react";
import styled, { useTheme, ThemeProvider } from "styled-components/native";
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageSourcePropType,
} from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Button } from "react-native-paper";
import LanguagePicker from "../../components/language-picker.component";
import Text from "../../components/text.component";
import { useNavigation } from "@react-navigation/native";
import {
  OnboardingScreenNavigationProp,
  OnboardingScreenProps,
} from "../../types/navigationTypes";
import { useTranslation } from "react-i18next";

import onboardingBg1 from "../../../assets/images/onboarding/onboarding-1.png";
import onboardingBg2 from "../../../assets/images/onboarding/onboarding-2.png";
import onboardingBg3 from "../../../assets/images/onboarding/onboarding-3.png";
import onboardingBg4 from "../../../assets/images/onboarding/onboarding-4.png";
import { darkTheme, lightTheme } from "../../infrastructure/theme/theme";

const onboardingBg1Typed: ImageSourcePropType =
  onboardingBg1 as ImageSourcePropType;
const onboardingBg2Typed: ImageSourcePropType =
  onboardingBg2 as ImageSourcePropType;
const onboardingBg3Typed: ImageSourcePropType =
  onboardingBg3 as ImageSourcePropType;
const onboardingBg4Typed: ImageSourcePropType =
  onboardingBg4 as ImageSourcePropType;

//////////// Styling start ///////////////

const SafeArea = styled(SafeAreaView)`
  flex: 1;
  margin-top: ${StatusBar.currentHeight}px;
`;

const OnboardingBackground = styled.ImageBackground`
  flex: 1;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
`;

const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
`;

const BodyContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

const TextButton = styled(Button).attrs((props) => ({
  mode: "text",
  compact: true,
  labelStyle: {
    ...props.theme.typography.buttonMedium,
    color: props.theme.colors.secondary.dark,
    marginRight: 0,
  },
}))``;

const SkipButton = styled(TextButton)``;
const LoginButton = styled(TextButton)``;

const ContentWrapper = styled.View`
  align-items: center;
  gap: ${(props) => props.theme.space.md}px;
  margin-bottom: ${(props) => props.theme.space.xl}px;
`;

const ButtonsWrapper = styled.View`
  flex-direction: row;
  align-items: stretch;
  gap: ${(props) => props.theme.space.md}px;
`;

const DefaultButton = styled(Button).attrs((props) => ({
  contentStyle: {
    height: 54,
  },
  labelStyle: {
    ...props.theme.typography.buttonLarge,
  },
}))`
  border-radius: 27px;
`;

const StatusNavContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 8px;
  width: 54px;
  margin-left: ${(props) => props.theme.space.xl}px;
  margin-right: ${(props) => props.theme.space.xl}px;
  margin-bottom: 32px;
`;

const NextButton = styled(DefaultButton).attrs((props) => ({
  mode: "contained",
  buttonColor: props.theme.colors.primary.dark,
}))`
  flex-grow: 1;
`;

const BackButton = styled(DefaultButton).attrs((props) => ({
  mode: "outlined",
  textColor: props.theme.colors.primary.dark,
  contentStyle: {
    width: undefined,
    height: 52,
  },
}))`
  border-color: ${(props) => props.theme.colors.primary.dark};
  width: undefined;
`;

const JoinButtonSocial = styled(DefaultButton).attrs((props) => ({
  mode: "contained",
  icon: "google",
  textColor: props.theme.colors.primary.dark,
  buttonColor: props.theme.colors.primary.light,
}))`
  flex-grow: 1;
  margin-bottom: ${(props) => props.theme.space.md}px;
`;

const JoinButtonEmail = styled(DefaultButton).attrs((props) => ({
  mode: "contained",
  icon: "email",
  buttonColor: props.theme.colors.primary.dark,
}))`
  flex-grow: 1;
`;

const FooterContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${(props) => props.theme.space.lg}px;
  margin-bottom: ${(props) => props.theme.space.lg}px;
  gap: ${(props) => props.theme.space.sm}px;
`;

//////////// Styling end ///////////////

interface SlidesProps {
  key: string;
  title: string;
  text: string;
  background: ImageSourcePropType;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const progress = useSharedValue(0);
  let theme = useTheme();
  theme = lightTheme;

  const slides: SlidesProps[] = [
    {
      key: "1",
      title: t("onboarding_1_title"),
      text: t("onboarding_1_description"),
      background: onboardingBg1Typed,
    },
    {
      key: "2",
      title: t("onboarding_2_title"),
      text: t("onboarding_2_description"),
      background: onboardingBg2Typed,
    },
    {
      key: "3",
      title: t("onboarding_3_title"),
      text: t("onboarding_3_description"),
      background: onboardingBg3Typed,
    },
    {
      key: "4",
      title: t("onboarding_4_title"),
      text: t("onboarding_4_description"),
      background: onboardingBg4Typed,
    },
  ];

  useEffect(() => {
    progress.value = withTiming(currentSlide, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate("Login");
    }
  };

  const handlePreviews = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleBackButton = () => {
    if (slides[currentSlide].key !== "1" && slides[currentSlide].key !== "4") {
      return <BackButton onPress={handlePreviews}>{t("back")}</BackButton>;
    }
  };

  const renderStatusNav = () => {
    return (
      <StatusNavContainer>
        {slides.slice(0, slides.length - 1).map((slide, index) => {
          const animatedStyle = useAnimatedStyle(() => ({
            backgroundColor:
              currentSlide === index
                ? theme.colors.secondary.dark
                : theme.colors.secondary.light,
            width:
              currentSlide === index
                ? withTiming(30, { duration: 300 })
                : withTiming(8, { duration: 300 }),
          }));

          return (
            <Animated.View
              key={slide.key}
              style={[
                slides[currentSlide].key !== "4" && styles.statusNavItem,
                animatedStyle,
              ]}
            />
          );
        })}
      </StatusNavContainer>
    );
  };

  return (
    <>
      <OnboardingBackground source={slides[currentSlide].background}>
        <Overlay />
        <SafeArea>
          <HeaderContainer>
            <LanguagePicker color={theme.colors.white} />
            <SkipButton
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              {t("skip")}
            </SkipButton>
          </HeaderContainer>
          <BodyContainer>
            <ContentWrapper>
              <Text
                fontVariant="h3"
                textColor={theme.colors.white}
                textAlign="center"
              >
                {slides[currentSlide].title}
              </Text>
              <Text
                fontVariant="bodyLarge"
                textColor={theme.colors.white}
                textAlign="center"
              >
                {slides[currentSlide].text}
              </Text>
            </ContentWrapper>
            {renderStatusNav()}
            <ButtonsWrapper>
              {slides[currentSlide].key === "4" && (
                <JoinButtonSocial onPress={() => {}}>
                  {t("onboarding_button_join_google")}
                </JoinButtonSocial>
              )}
            </ButtonsWrapper>
            <ButtonsWrapper>
              {handleBackButton()}
              {slides[currentSlide].key !== "4" ? (
                <NextButton onPress={handleNext}>
                  {t("onboarding_button_next")}
                </NextButton>
              ) : (
                <JoinButtonEmail
                  onPress={() => {
                    navigation.navigate("Login");
                  }}
                >
                  {t("onboarding_button_join_email")}
                </JoinButtonEmail>
              )}
            </ButtonsWrapper>
          </BodyContainer>
          <FooterContainer>
            <Text
              fontVariant="bodyMedium"
              textColor={theme.colors.white}
              textAlign="left"
            >
              {t("already_have_account")}
            </Text>
            <LoginButton
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              {t("login")}
            </LoginButton>
          </FooterContainer>
        </SafeArea>
      </OnboardingBackground>
    </>
  );
};

const styles = StyleSheet.create({
  statusNavItem: {
    height: 8,
    borderRadius: 50,
  },
});

export default OnboardingScreen;
