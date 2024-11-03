import React, { ReactNode } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import styled from "styled-components/native";

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
  margin-top: ${StatusBar.currentHeight}px;
`;

export const BackgroundColor: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <SafeArea>{children}</SafeArea>;
};
