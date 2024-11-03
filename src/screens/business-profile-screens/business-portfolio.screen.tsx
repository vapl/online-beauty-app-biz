import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BackgroundColor } from "../../components/background-color.component";

const BusinessPortfolioScreen: React.FC = () => {
  return (
    <BackgroundColor>
      <View style={styles.container}>
        <Text style={styles.text}>Business Portfolio</Text>
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

export default BusinessPortfolioScreen;
