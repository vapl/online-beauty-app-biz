import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ServicesScreenProps } from "../../types/navigationTypes";
import { BackgroundColor } from "../../components/background-color.component";

const ServicesScreen: React.FC<ServicesScreenProps> = () => {
  return (
    <BackgroundColor>
      <View style={styles.container}>
        <Text style={styles.text}>Services</Text>
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

export default ServicesScreen;
