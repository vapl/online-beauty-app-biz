import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

interface SpacingProps {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}

const Space: React.FC<SpacingProps> = ({
  left = 0,
  top = 0,
  right = 0,
  bottom = 0,
}) => {
  return <StyledView left={left} top={top} right={right} bottom={bottom} />;
};

const StyledView = styled(View)<SpacingProps>`
  margin-left: ${({ left }) => left}px;
  margin-top: ${({ top }) => top}px;
  margin-right: ${({ right }) => right}px;
  margin-bottom: ${({ bottom }) => bottom}px;
`;

export default Space;
