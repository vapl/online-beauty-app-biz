import React from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import styled from "styled-components/native";
import { useTheme } from "styled-components/native";
import { StyleSheet } from "react-native";

const StatusNavContainer = styled.View`
  align-self: center;
  flex-direction: row;
  justify-content: center;
  gap: ${(props) => props.theme.space.md}px;
  align-items: center;
  height: 8px;
  width: 100px;
  margin-left: ${(props) => props.theme.space.xl}px;
  margin-right: ${(props) => props.theme.space.xl}px;
  margin-top: ${(props) => props.theme.space.xl}px;
  margin-bottom: ${(props) => props.theme.space.xl}px;
`;

const StatusNavItem = styled(Animated.View)`
  height: 8px;
  border-radius: 50px;
`;

interface StatusNavProps {
  currentStep: number;
  totalSteps: number;
}

const StatusNav: React.FC<StatusNavProps> = ({ currentStep, totalSteps }) => {
  const theme = useTheme();

  return (
    <StatusNavContainer>
      {[...Array(totalSteps).keys()].map((_, index) => {
        const animatedStyle = useAnimatedStyle(() => ({
          backgroundColor:
            currentStep === index
              ? theme.colors.secondary.dark
              : theme.colors.grey[40],
          width:
            currentStep === index
              ? withTiming(30, { duration: 300 })
              : withTiming(8, { duration: 300 }),
        }));

        return (
          <StatusNavItem
            key={index}
            style={[styles.statusNavItem, animatedStyle]}
          />
        );
      })}
    </StatusNavContainer>
  );
};

const styles = StyleSheet.create({
  statusNavItem: {
    height: 8,
    borderRadius: 50,
  },
});

export default StatusNav;
