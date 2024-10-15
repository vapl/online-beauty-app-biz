import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TeamScreenProps } from "../../types/navigationTypes";
import { BackgroundColor } from "../../components/background-color.component";

const TeamScreen: React.FC<TeamScreenProps> = () => {
  return (
    <BackgroundColor>
      <View style={styles.container}>
        <Text style={styles.text}>Team</Text>
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

export default TeamScreen;
