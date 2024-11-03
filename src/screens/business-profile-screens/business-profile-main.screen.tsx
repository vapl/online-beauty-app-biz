import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
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
import * as ImagePicker from "expo-image-picker";
import {
  deleteBusinessImage,
  getBusinessImages,
} from "../../services/business/imageService";
import { UserContext } from "../../context/UserProvider";
import LoadingSpinner from "../../components/loading-spinner.component";
import CustomModal from "../../components/modals/custom-modal.component";
import {
  addUpdateBusinessImage,
  addUpdatePortfolioImages,
} from "../../services/business/imageService";
import { handleError } from "../../utils/errorHandler";
import { getReview } from "../../services/business/reviewsService";
import Toast from "react-native-root-toast";
import showToast from "../../utils/toastConfig";
import SectionHeader from "../../components/section-header.component";

type ImageType = "coverImage" | "businessLogo" | "portfolioImages";

const coverPlaceholderImage =
  "https://firebasestorage.googleapis.com/v0/b/onlinebeautyapp-e572d.appspot.com/o/placeholders%2Fcover_image_placeholder.jpg?alt=media&token=32e39a02-86e7-462e-aea2-834c1738ba0e";
const avatarPlaceholderImage =
  "https://firebasestorage.googleapis.com/v0/b/onlinebeautyapp-e572d.appspot.com/o/placeholders%2FProfile_avatar_placeholder_large.png?alt=media&token=8ea5f1ce-32a6-4268-843d-5d777ff91558";

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
  top: 24px;
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
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
`;

const SectionTitle = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.space.md}px;
`;

const GaleryItem = styled(Image)`
  height: 100px;
  width: 100px;
  border-radius: 8px;
`;

const PortfolioButtonsWrapper = styled(View)`
  gap: 16px;
`;

const ExternalLinksWrapper = styled(View)`
  width: 100%;
  justify-content: center;
  gap: 16px;
`;

// end <- Styles

const BusinessProfileMainScreen: React.FC<{
  onScrollChange: (showHeader: boolean) => void;
}> = ({ onScrollChange }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<BusinessProfileMainNavigationProp>();
  const [imageType, setImageType] = useState<ImageType>("businessLogo");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [businessId, setBusinessId] = useState<string>("");
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
  const [averageBusinessRating, setAverageBusinessRating] = useState<number>(0);
  const businessContext = useContext(BusinessContext);
  const userContext = useContext(UserContext);
  if (!businessContext || !userContext) return;
  const {
    businessData,
    portfolioImages,
    completedSelections,
    totalSelections,
  } = businessContext;
  const { user, userProfile } = userContext;

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!userProfile?.businessId) return;
    setBusinessId(userProfile.businessId);
  }, [userProfile?.businessId]);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        if (businessId) {
          const businessReviews = await getReview(businessId, "business");
          const locationReviews = await getReview(businessId, "location");
          const employeeReviews = await getReview(businessId, "employee");
          const ratings = [
            ...businessReviews.map((review) => review.rating),
            ...locationReviews.map((review) => review.rating),
            ...employeeReviews.map((review) => review.rating),
          ];

          const averageRating =
            ratings.length > 0
              ? ratings.reduce((acc, rating) => acc + rating, 0) /
                ratings.length
              : 0;
          setAverageBusinessRating(Number(averageRating.toFixed(1)));
        }
      } catch (error) {
        handleError(error, "Error fetching review");
      }
    };
    fetchReview();
  }, [businessId]);

  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      if (value > 150) {
        onScrollChange(true);
      } else {
        onScrollChange(false);
      }
    });
    return () => {
      scrollY.removeListener(listener);
    };
  }, [scrollY, onScrollChange]);

  const marginLeft = scrollX.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
    extrapolate: "clamp",
  });

  // Funkcija, lai konvertētu attēla URI uz Blob
  const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const pickImage = async (type: ImageType) => {
    // Pieprasām piekļuvi bilžu bibliotēkai
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Lūdzu piešķirt piekļuvi bilžu bibliotēkai");
      return;
    }

    // Atveram attēlu izvēles dialogu
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: type !== "portfolioImages", // Portfolio attēlus neļaujam rediģēt
      allowsMultipleSelection: type === "portfolioImages", // Tikai portfolio atļaujam vairākus izvēlēties
      aspect: [16, 9],
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets.length > 0 && user) {
      setModalIsVisible(false);
      setIsLoading(true);

      try {
        if (type === "portfolioImages") {
          const images = await Promise.all(
            pickerResult.assets.map(async (asset) => {
              return { file: await uriToBlob(asset.uri), caption: "" };
            })
          );
          await addUpdatePortfolioImages(images, user.uid);
        } else {
          // Citos gadījumos augšupielādējam attiecīgo attēlu
          const imageUri = pickerResult.assets[0].uri;
          const imageBlob = await uriToBlob(imageUri);

          // Saglabājam attēla URL Firestore
          await addUpdateBusinessImage(user.uid, type, imageBlob);
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
      } finally {
        setIsLoading(false);
        showToast({
          message: t("profile_image_success"),
          type: "info",
          position: "top",
        });
      }
    }
  };

  const deleteImage = async (type: "businessLogo" | "coverImage") => {
    if (!user) return;
    setModalIsVisible(false);
    setIsLoading(true);

    try {
      // Dzēšam attēlu no Firestore un Firebase Storage
      await deleteBusinessImage(businessId, type);
    } catch (error) {
      console.error("Failed to delete image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteButtonDisabled = () => {
    if (!businessData?.images?.businessLogo && imageType === "businessLogo") {
      return true;
    } else if (
      !businessData?.images?.coverImage &&
      imageType === "coverImage"
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <BackgroundColor>
        {/* <SnackbarMessage status="success" visible={true} /> */}
        <ScrollView
          automaticallyAdjustKeyboardInsets
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "flex-start",
            paddingBottom: 50,
            flexGrow: 1,
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >
          <HeroSection>
            <HeroCover>
              <LoadingSpinner
                isLoading={isLoading && imageType === "coverImage"}
              />
              <Image
                source={{
                  uri:
                    businessData?.images?.coverImage || coverPlaceholderImage,
                }}
                resizeMode="cover"
                style={{ height: "100%" }}
              />
              <HeroCoverOverly />
            </HeroCover>
            <HeroHeader>
              <HeroHeaderImageBg>
                <LoadingSpinner
                  isLoading={isLoading && imageType === "businessLogo"}
                />
                {(userProfile?.role === "owner" ||
                  userProfile?.role === "admin") && (
                  <HeroHeaderImageEditBg
                    onPress={() => {
                      setImageType("businessLogo");
                      setModalIsVisible(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="pencil" size={18} />
                  </HeroHeaderImageEditBg>
                )}
                <HeroHeaderImage
                  source={{
                    uri:
                      businessData?.images?.businessLogo ||
                      avatarPlaceholderImage,
                  }}
                />
              </HeroHeaderImageBg>
              <HeroHeaderContent>
                <HeroHeaderRaiting>
                  <RaitingStars
                    count={5}
                    value={averageBusinessRating ? averageBusinessRating : 0}
                    color={theme.colors.primary.light}
                  />
                </HeroHeaderRaiting>
                <HeroHeaderTitle>
                  <Text fontVariant="h4">{businessData?.businessName}</Text>
                </HeroHeaderTitle>
              </HeroHeaderContent>
              {(userProfile?.role === "owner" ||
                userProfile?.role === "admin") && (
                <HeroCoverEditBg
                  onPress={() => {
                    setImageType("coverImage");
                    setModalIsVisible(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="pencil" size={18} />
                </HeroCoverEditBg>
              )}
            </HeroHeader>
          </HeroSection>
          <BodySection>
            <Space height={16} />
            <ProfileStatusComponent
              quantity={totalSelections}
              completed={completedSelections}
              onPress={() => {
                navigation.navigate("BusinessProfileStatus");
              }}
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
            <Space height={32} />
            <SectionHeader
              title={t("portfolio_title")}
              buttonStyle="text"
              buttonColor={theme.colors.secondary.dark}
              buttonLabel={t("text_button_more")}
              onPress={() => {
                navigation.navigate("BusinessPortfolio");
              }}
            />
          </BodySection>
          <Animated.FlatList
            data={portfolioImages || []}
            renderItem={({ item }) => (
              <>
                <LoadingSpinner isLoading={isLoading && item === null} />
                <GaleryItem source={{ uri: item.imageUrl }} />
              </>
            )}
            keyExtractor={(item) => item.imageUrl}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            contentContainerStyle={{
              paddingLeft: marginLeft,
              paddingRight: 16,
              gap: 20,
            }}
          />
          <Space height={16} />
          <BodySection>
            <PortfolioButtonsWrapper>
              <Button
                mode={"outlined"}
                label={t("button_add_from_phone")}
                icon="image-outline"
                buttonSize="sm"
                onPress={() => {
                  setImageType("portfolioImages");
                  pickImage("portfolioImages");
                }}
              />
              <Button
                mode={"outlined"}
                label={t("button_add_from_instagram")}
                icon="instagram"
                buttonSize="sm"
                disabled={true}
              />
            </PortfolioButtonsWrapper>
            <Space height={32} />
            <SectionHeader
              title={t("title_last_reviews")}
              buttonColor={theme.colors.secondary.dark}
              button={false}
            />
            {/* REVIEWS PLACEHOLDER */}
            <SectionHeader
              title={t("external_links")}
              buttonColor={theme.colors.secondary.dark}
              button={
                userProfile?.role === "owner" || userProfile?.role === "admin"
              }
              onPress={() => {}}
            />
            <ExternalLinksWrapper>
              <Button
                mode={"text"}
                icon="web"
                iconColor={theme.colors.grey[80]}
                label={
                  businessData?.socialLinks?.website
                    ? businessData?.socialLinks?.website
                    : "www.yourwebpage.lv"
                }
                labelColor={theme.colors.text}
                disabled={businessData?.socialLinks?.website ? false : true}
              />
              <Button
                mode={"text"}
                icon="facebook"
                iconColor={theme.colors.grey[80]}
                label={"facebook.com/username"}
                labelColor={theme.colors.text}
                disabled={businessData?.socialLinks?.facebook ? false : true}
              />
              <Button
                mode={"text"}
                icon="instagram"
                iconColor={theme.colors.grey[80]}
                label={"instagram.com/username"}
                justifyContent="flex-start"
                labelColor={theme.colors.text}
                disabled={businessData?.socialLinks?.instagram ? false : true}
              />
            </ExternalLinksWrapper>
          </BodySection>
        </ScrollView>
        <CustomModal
          visible={modalIsVisible}
          title={
            imageType === "coverImage"
              ? t("edit_cover_image")
              : t("edit_avatar_image")
          }
          onClose={() => {
            setModalIsVisible(false);
          }}
          onPress={function (): void {
            throw new Error("Function not implemented.");
          }}
          isStatic={true}
          initialModalHeight={0.3}
          bodyStyle={{ justifyContent: "flex-end", gap: 16 }}
        >
          <View>
            <Button
              mode={"outlined"}
              label={t("button_add_from_phone")}
              icon="image-outline"
              iconColor={theme.colors.primary.dark}
              buttonSize="lg"
              onPress={() => {
                if (imageType) {
                  pickImage(imageType);
                }
              }}
            />
            <Space height={16} />
            <Button
              mode={"outlined"}
              label={t("delete")}
              icon="trash-can-outline"
              iconColor={theme.colors.accent.darkPink}
              labelColor={theme.colors.accent.darkPink}
              disabled={handleDeleteButtonDisabled()}
              onPress={() => {
                if (
                  imageType === "coverImage" ||
                  imageType === "businessLogo"
                ) {
                  deleteImage(imageType);
                }
              }}
            />
          </View>
          <Space height={16} />
        </CustomModal>
      </BackgroundColor>
    </>
  );
};

export default BusinessProfileMainScreen;
