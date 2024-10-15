import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PaymentsAndBillingScreenProps } from "../../types/navigationTypes";
import { BackgroundColor } from "../../components/background-color.component";

const PaymentsAndBillingScreen: React.FC<
  PaymentsAndBillingScreenProps
> = () => {
  return (
    <BackgroundColor>
      <View style={styles.container}>
        <Text style={styles.text}>Payments And Billing</Text>
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

export default PaymentsAndBillingScreen;
