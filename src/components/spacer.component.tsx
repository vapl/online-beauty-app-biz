import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";

interface SpacingProps {
  height?: number;
  width?: number;
}

const Space: React.FC<SpacingProps> = ({ height = 0, width = 0 }) => {
  return <StyledView height={height / 2} width={width / 2} />;
};

const StyledView = styled(View)<SpacingProps>`
  margin-left: ${({ width }) => (width ? width / 2 : 0)}px;
  margin-top: ${({ height }) => (height ? height / 2 : 0)}px;
  margin-right: ${({ width }) => (width ? width / 2 : 0)}px;
  margin-bottom: ${({ height }) => (height ? height / 2 : 0)}px;
`;

export default Space;
