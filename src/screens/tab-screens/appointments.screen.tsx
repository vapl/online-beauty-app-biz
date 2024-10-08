import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../../components/text.component";
import { AppointmentsScreenProps } from "../../types/navigationTypes";
import { BackgroundColor } from "../../components/background-color.component";

const AppointmentsScreen: React.FC<AppointmentsScreenProps> = () => {
  return (
    <BackgroundColor>
      <View style={styles.container}>
        <Text fontVariant="bodyLarge">Appointments</Text>
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

export default AppointmentsScreen;
