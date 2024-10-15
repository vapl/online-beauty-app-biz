import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ServicesScreenProps } from "../../types/navigationTypes";
import { BackgroundColor } from "../../components/background-color.component";

const BusinessLocations: React.FC = () => {
  return (
    <BackgroundColor>
      <View style={styles.container}>
        <Text style={styles.text}>Business Locations</Text>
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

export default BusinessLocations;
