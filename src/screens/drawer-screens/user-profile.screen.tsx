import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { UserProfileNavigationProp } from "../../types/navigationTypes";

const UserProfileScreen: React.FC<UserProfileNavigationProp> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>User Profile Screen</Text>
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

export default UserProfileScreen;
