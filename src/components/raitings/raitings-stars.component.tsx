import React, { useState } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const StarsConteiner = styled(View)`
  flex-direction: row;
  gap: 4px;
`;

interface RaitingStarsProps {
  value: number;
  count: number;
  color?: string;
  size?: number;
}

const RaitingStars: React.FC<RaitingStarsProps> = ({
  value,
  count = 5,
  color = "#FFD700",
  size = 20,
}) => {
  const renderStar = (index: number) => {
    if (value >= index + 1) {
      return "star";
    } else if (value >= index + 0.5) {
      return "star-half";
    } else {
      return "star-outline";
    }
  };

  return (
    <StarsConteiner>
      {Array.from({ length: count }).map((_, index) => (
        <Ionicons
          key={index}
          name={renderStar(index)}
          size={size}
          color={color}
        />
      ))}
    </StarsConteiner>
  );
};

export default RaitingStars;
