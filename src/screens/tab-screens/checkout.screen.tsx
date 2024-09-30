import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckoutScreenProps } from "../../types/navigationTypes";

const CheckoutScreen: React.FC<CheckoutScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Checkout</Text>
    </View>
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
