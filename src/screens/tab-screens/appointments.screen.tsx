import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AppointmentsScreenProps } from "../../types/navigationTypes";

const AppointmentsScreen: React.FC<AppointmentsScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Appointments</Text>
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

export default AppointmentsScreen;
