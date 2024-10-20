import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, View } from "react-native";
import {
  BusinessProfileStatusScreenProps,
  BusinessProfileStatusNavigationProp,
} from "../../types/navigationTypes";
import styled, { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Input from "../../components/inputs/input.component";
import Text from "../../components/text.component";
import { UserContext } from "../../context/UserProvider";
import { BusinessContext } from "../../context/BusinessProvider";
import Space from "../../components/spacer.component";
import ListItem from "../../components/button/list-item.component";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "../../components/button/button.component";

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

const BusinessProfileStatusScreen: React.FC<
  BusinessProfileStatusScreenProps
> = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<BusinessProfileStatusNavigationProp>();
  const userContext = useContext(UserContext);
  const businessContext = useContext(BusinessContext);

  if (!businessContext) return null;
  let { businessData, totalSelections, completedSelections } = businessContext;

  const isBusinessDataFilled: boolean = !!businessData?.businessName;
  const areImagesFilled: boolean =
    !!businessData?.images?.businessLogo && !!businessData.images.coverImage;
  const isLocationFilled: boolean =
    !!businessData?.location?.address &&
    !!businessData.location.country &&
    !!businessData.location.city;
  const isOpeningHOursFilled =
    !!businessData?.openingHours?.monday?.start ||
    !!businessData?.openingHours?.tuesday?.start ||
    !!businessData?.openingHours?.wednesday?.start ||
    !!businessData?.openingHours?.thursday?.start ||
    !!businessData?.openingHours?.friday?.start ||
    !!businessData?.openingHours?.saturday?.start ||
    !!businessData?.openingHours?.sunday?.start;
  const areSocialLinksFilled: boolean =
    !!businessData?.socialLinks?.website ||
    !!businessData?.socialLinks?.facebook ||
    !!businessData?.socialLinks?.instagram ||
    !!businessData?.socialLinks?.X ||
    !!businessData?.socialLinks?.linkedin;

  interface ItemProps {
    id: number;
    title: string;
    subtitle: string;
    completed: boolean;
  }

  const items: ItemProps[] = [
    {
      id: 1,
      title: t("company_info_title"),
      subtitle: t("company_info_description"),
      completed: isBusinessDataFilled,
    },
    {
      id: 2,
      title: t("profile_images_title"),
      subtitle: t("profile_images_description"),
      completed: areImagesFilled,
    },
    {
      id: 3,
      title: t("locations_title"),
      subtitle: t("locations_description"),
      completed: isLocationFilled,
    },
    {
      id: 4,
      title: t("opening_hours_title"),
      subtitle: t("opening_hours_description"),
      completed: isOpeningHOursFilled,
    },
    {
      id: 5,
      title: t("social_links_title"),
      subtitle: t("social_links_description"),
      completed: areSocialLinksFilled,
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          mode={"icon"}
          iconName="chevron-back"
          iconColor={theme.colors.text}
          onPress={() => navigation.goBack()}
        />
      ),
      headerRight: () => (
        <Text fontVariant="bodySmall">
          {t("completed_tasks", {
            completed: completedSelections,
            total: totalSelections,
            comleted_lv: completedSelections > 1 ? "izpildīti" : "izpildīts",
          })}
        </Text>
      ),
    });
  });

  return (
    <Background>
      <SafeArea>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenContainer>
            <Space top={32} />
            <Header>
              <Text fontVariant="h3">{t("profile_status_title")}</Text>
              <Text fontVariant="bodyMedium">
                {t("profile_status_description")}
              </Text>
            </Header>
            <Space top={32} />
            {items.map((item) => (
              <ListItem
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                iconLeft={
                  item.completed ? (
                    <Ionicons
                      name="checkmark"
                      color={theme.colors.primary.dark}
                      size={25}
                    />
                  ) : (
                    <View />
                  )
                }
                lefIconContainerBackground={theme.colors.background}
                leftIconContainerBorderRadius={8}
                leftIconContainerBorder={true}
              />
            ))}

            <ScrollView
              automaticallyAdjustKeyboardInsets
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                justifyContent: "center",
                paddingBottom: 150,
                flex: 1,
              }}
            ></ScrollView>
          </ScreenContainer>
        </ScrollView>
      </SafeArea>
    </Background>
  );
};

export default BusinessProfileStatusScreen;
