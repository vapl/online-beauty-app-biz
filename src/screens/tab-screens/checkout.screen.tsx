import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckoutScreenProps } from "../../types/navigationTypes";
import { BackgroundColor } from "../../components/background-color.component";

const CheckoutScreen: React.FC<CheckoutScreenProps> = () => {
  return (
    <BackgroundColor>
      <View style={styles.container}>
        <Text style={styles.text}>Checkout</Text>
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

export default CheckoutScreen;
