import React, { ReactNode } from "react";
import { View } from "react-native";
import styled from "styled-components/native";

interface BackgroundColorProps {
  children: ReactNode;
  color?: string;
}

const Background = styled(View)<{ color?: string }>`
  background-color: ${(props) =>
    props.color ? props.color : props.theme.colors.background};
  flex: 1;
`;

export const BackgroundColor: React.FC<BackgroundColorProps> = ({
  children,
  color,
}) => {
  return <Background color={color}>{children}</Background>;
};
