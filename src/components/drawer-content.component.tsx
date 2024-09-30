import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import styled from "styled-components/native";
import ListItem from "./button/list-item.component";

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <ListItem />
      <DrawerItem
        label="Home"
        onPress={() => props.navigation.navigate("HomeTabs")}
      />
      <DrawerItem
        label="Settings"
        onPress={() => props.navigation.navigate("Settings")}
      />
    </DrawerContentScrollView>
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
    marginVertical: 20,
  },
});

export default CustomDrawerContent;
