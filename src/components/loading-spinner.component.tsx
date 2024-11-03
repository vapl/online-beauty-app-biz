import React from "react";
import { ActivityIndicator } from "react-native-paper";
import { View } from "react-native";
import styled from "styled-components/native";
import { useTheme } from "styled-components/native";

const IndicatorWrapper = styled(View)<{ background: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  ${(props) =>
    props.background ? "background-color: rgba(255, 255, 255, 0.8);" : ""}

  z-index: 1000;
`;

const LoadingSpinner: React.FC<{
  isLoading: boolean;
  background?: boolean;
}> = ({ isLoading = false, background = true }) => {
  const theme = useTheme();
  return isLoading ? (
    <IndicatorWrapper background={background}>
      <ActivityIndicator size={"large"} color={theme.colors.primary.dark} />
    </IndicatorWrapper>
  ) : null;
};

export default LoadingSpinner;
