import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ClientsScreenProps } from "../../types/navigationTypes";
import { BackgroundColor } from "../../components/background-color.component";

const ClientsScreen: React.FC<ClientsScreenProps> = () => {
  return (
    <BackgroundColor>
      <View style={styles.container}>
        <Text style={styles.text}>Clients</Text>
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

export default ClientsScreen;
