import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MarketingScreenProps } from "../../types/navigationTypes";
import { BackgroundColor } from "../../components/background-color.component";

const MarketingScreen: React.FC<MarketingScreenProps> = () => {
  return (
    <BackgroundColor>
      <View style={styles.container}>
        <Text style={styles.text}>Marketing</Text>
      </View>
    </BackgroundColor>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
  },
});

export default MarketingScreen;
