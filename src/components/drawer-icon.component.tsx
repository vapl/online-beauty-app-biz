import React, { useEffect, useRef, useContext, useState } from "react";
import { useDrawerProgress, useDrawerStatus } from "@react-navigation/drawer";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Image, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

import { IconButton } from "react-native-paper";
import styled, { useTheme } from "styled-components/native";
import Text from "./text.component";
import { UserContext } from "../context/UserProvider";
import { BusinessContext } from "../context/BusinessProvider";

interface CustomDrawerIconProps {
  onPress?: () => void;
  size: number;
  type?: "icon" | "image";
  icon?: string;
}

const IconWrapper = styled(View)`
  padding-left: ${(props) => props.theme.space.md}px;
`;

const CustomDrawerIcon: React.FC<CustomDrawerIconProps> = ({
  onPress = () => {},
  size = 24,
  type = "icon",
  icon = "home",
}) => {
  const theme = useTheme();
  const drawerStatus = useDrawerStatus();
  const progress = useDrawerProgress();
  const userContext = useContext(UserContext);
  const businessContext = useContext(BusinessContext);
  const [businessFirstChar, SetBusinessFirstChar] = useState<string>("");
  if (!userContext || !businessContext) return;
  const { user } = userContext;
  const { businessData } = businessContext;

  useEffect(() => {
    if (businessData?.businessName) {
      const businessName = businessData?.businessName;
      SetBusinessFirstChar(businessName?.charAt(0));
    }
  }, [businessData?.businessName, drawerStatus]);

  // Animated value
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value, // progress.value is the animated value from 0 to 1
      [0, 1], // Input range: 0 (drawer closed) to 1 (drawer fully open)
      [1, 0.1] // Output range: Full opacity to dimmed opacity
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View style={[animatedStyle]}>
      <IconWrapper>
        {type === "icon" ? (
          <IconButton
            icon={`${drawerStatus === "open" ? "" : icon}`}
            size={size}
            style={{
              margin: undefined,
              padding: undefined,
              width: size,
              height: size,
            }}
            onPress={onPress}
          />
        ) : drawerStatus === "closed" ? (
          <TouchableOpacity onPress={onPress}>
            {businessData?.businessLogo ? (
              <Image
                style={{
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                }}
                source={{ uri: businessData.businessLogo }}
              />
            ) : (
              <View
                style={{
                  height: size,
                  width: size,
                  borderWidth: 1,
                  borderColor: theme.colors.grey[80],
                  borderRadius: size / 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text fontVariant="buttonLarge" onPress={onPress}>
                  {businessFirstChar}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          ""
        )}
      </IconWrapper>
    </Animated.View>
  );
};

export default CustomDrawerIcon;
