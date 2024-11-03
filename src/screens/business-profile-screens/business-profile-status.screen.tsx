import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, View } from "react-native";
import {
  BusinessProfileStatusScreenProps,
  BusinessProfileStatusNavigationProp,
} from "../../types/navigationTypes";
import styled, { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Text from "../../components/text.component";
import { UserContext } from "../../context/UserProvider";
import { BusinessContext } from "../../context/BusinessProvider";
import Space from "../../components/spacer.component";
import ListItem from "../../components/button/list-item.component";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "../../components/button/button.component";
import { getLocations } from "../../services/business/locationService";
import { Location } from "../../types/firestore-types/locationTypes";

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
  const [location, setLocation] = useState<Location | undefined>(undefined);

  if (!businessContext) return null;
  let { businessData, totalSelections, completedSelections } = businessContext;

  useEffect(() => {
    const fetchLocation = async () => {
      if (!businessData?.businessId) return;
      const locationData = await getLocations(businessData?.businessId);

      if (locationData && locationData.length > 0) {
        const primaryLoaction = locationData[0];

        setLocation({
          ...primaryLoaction,
          name: primaryLoaction.name,
        });
      }
    };
    fetchLocation();
  }, [!businessData?.businessId]);

  const isBusinessDataFilled: boolean =
    !!businessData?.businessName &&
    !!businessData.phone &&
    !!businessData.email &&
    !!businessData?.legalAddress?.address;
  const areImagesFilled: boolean =
    !!businessData?.images?.businessLogo && !!businessData.images.coverImage;
  const isLocationFilled: boolean =
    !!location?.name &&
    !!location.address &&
    !!location.city &&
    !!location.postalCode;
  const isOpeningHOursFilled =
    !!location?.openingHours?.monday?.start ||
    !!location?.openingHours?.tuesday?.start ||
    !!location?.openingHours?.wednesday?.start ||
    !!location?.openingHours?.thursday?.start ||
    !!location?.openingHours?.friday?.start ||
    !!location?.openingHours?.saturday?.start ||
    !!location?.openingHours?.sunday?.start;
  const areSocialLinksFilled: boolean =
    !!businessData?.socialLinks?.website ||
    !!businessData?.socialLinks?.facebook ||
    !!businessData?.socialLinks?.instagram;

  interface ItemProps {
    title: string;
    subtitle: string;
    completed: boolean;
  }

  const items: ItemProps[] = [
    {
      title: t("company_info_title"),
      subtitle: t("company_info_description"),
      completed: isBusinessDataFilled,
    },
    {
      title: t("profile_images_title"),
      subtitle: t("profile_images_description"),
      completed: areImagesFilled,
    },
    ...(!businessData?.onsiteService
      ? [
          {
            title: t("locations_title"),
            subtitle: t("locations_description"),
            completed: isLocationFilled,
          },
        ]
      : []),
    {
      title: t("opening_hours_title"),
      subtitle: t("opening_hours_description"),
      completed: isOpeningHOursFilled,
    },
    {
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
            <Space height={32} />
            <Header>
              <Text fontVariant="h3">{t("profile_status_title")}</Text>
              <Text fontVariant="bodyMedium">
                {t("profile_status_description")}
              </Text>
            </Header>
            <Space height={32} />
            {items.map((item, key) => (
              <ListItem
                key={key}
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
                onPress={() => {}}
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
