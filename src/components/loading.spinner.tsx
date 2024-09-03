import React from "react";
import { ActivityIndicator } from "react-native-paper";
import { View } from "react-native";
import styled from "styled-components/native";

const IndicatorWrapper = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
`;

const LoadingSpinner: React.FC = () => {
  return (
    <IndicatorWrapper>
      <ActivityIndicator size={"large"} color="black" />
    </IndicatorWrapper>
  );
};

export default LoadingSpinner;
