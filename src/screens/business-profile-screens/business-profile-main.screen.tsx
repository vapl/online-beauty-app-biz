import React, { useContext, useState } from "react";
import { View, Image, TouchableOpacity, ScrollView } from "react-native";
import styled, { useTheme } from "styled-components/native";
import Text from "../../components/text.component";
import { BackgroundColor } from "../../components/background-color.component";
import Button from "../../components/button/button.component";
import Ionicons from "@expo/vector-icons/Ionicons";
import RaitingStars from "../../components/raitings/raitings-stars.component";
import { BusinessContext } from "../../context/BusinessProvider";
import ListItem from "../../components/button/list-item.component";
import { useNavigation } from "@react-navigation/native";
import {
  BusinessProfileMainNavigationProp,
  BusinessProfileStackNavigationProp,
} from "../../types/navigationTypes";
import { useTranslation } from "react-i18next";
import ProfileStatusComponent from "../../components/profile-status.component";
import Space from "../../components/spacer.component";

// Start -> Styles

const HeroSection = styled(View)`
  height: 248px;
`;

const HeroCover = styled(View)`
  background-color: grey;
  height: 208px;
`;

const HeroCoverOverly = styled(View)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
`;

const HeroHeader = styled(View)`
  position: absolute;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: 100%;
  bottom: 0;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
`;

const HeroHeaderImageBg = styled(View)`
  background-color: ${(props) => props.theme.colors.background};
  height: 88px;
  width: 88px;
  border-radius: 44px;
  justify-content: center;
  align-items: center;
`;

const HeroHeaderImage = styled(Image)`
  height: 80px;
  width: 80px;
  border-radius: 40px;
`;

const HeroEditButtonBase = styled(TouchableOpacity)`
  height: 34px;
  width: 34px;
  position: absolute;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 17px;
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3);
  right: 0;
  z-index: 999;
`;

const HeroHeaderImageEditBg = styled(HeroEditButtonBase)`
  top: -10px;
  right: 0;
`;

const HeroCoverEditBg = styled(HeroEditButtonBase)`
  bottom: -8px;
  right: 16px;
`;

const HeroHeaderContent = styled(View)`
  height: 100%;
  justify-content: center;
  gap: 8px;
`;

const HeroHeaderRaiting = styled(View)`
  height: 50%;
  justify-content: flex-end;
`;

const HeroHeaderTitle = styled(View)`
  height: 50%;
  justify-content: center;
`;

const BodySection = styled(View)`
  flex: 1;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
`;

// end <- Styles

const BusinessProfileMainScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<BusinessProfileMainNavigationProp>();
  const businessContext = useContext(BusinessContext);
  if (!businessContext) return;

  const { businessData } = businessContext;

  return (
    <>
      <BackgroundColor>
        <ScrollView
          automaticallyAdjustKeyboardInsets
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "flex-start",
            paddingBottom: 150,
            flexGrow: 1,
          }}
        >
          <HeroSection>
            <HeroCover>
              <HeroCoverOverly />
              <HeroCoverEditBg onPress={() => {}} activeOpacity={0.7}>
                <Ionicons name="pencil" size={18} />
              </HeroCoverEditBg>
            </HeroCover>
            <HeroHeader>
              <HeroHeaderImageBg>
                <HeroHeaderImageEditBg onPress={() => {}} activeOpacity={0.7}>
                  <Ionicons name="pencil" size={18} />
                </HeroHeaderImageEditBg>
                <HeroHeaderImage
                  source={{
                    uri: businessData?.businessLogo,
                  }}
                />
              </HeroHeaderImageBg>
              <HeroHeaderContent>
                <HeroHeaderRaiting>
                  <RaitingStars
                    count={5}
                    value={3}
                    color={theme.colors.primary.light}
                  />
                </HeroHeaderRaiting>
                <HeroHeaderTitle>
                  <Text fontVariant="h4">{businessData?.businessName}</Text>
                </HeroHeaderTitle>
              </HeroHeaderContent>
            </HeroHeader>
          </HeroSection>
          <BodySection>
            <Space top={16} />
            <ProfileStatusComponent
              quantity={5}
              completed={0}
              onPress={() => {}}
            />
            <ListItem
              title={t("business_profile_business_info_title")}
              subtitle={t("business_profile_business_info_subtitle")}
              onPress={() => navigation.navigate("BusinessInfo")}
            />
            <ListItem
              title={t("business_profile_business_locations_title")}
              subtitle={t("business_profile_business_locations_subtitle")}
              onPress={() => navigation.navigate("BusinessLocations")}
            />
          </BodySection>
        </ScrollView>
      </BackgroundColor>
    </>
  );
};

export default BusinessProfileMainScreen;
