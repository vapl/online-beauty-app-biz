import React from "react";
import { View } from "react-native";
import Text from "../text.component";

interface ListItemProps {}

const ListItem: React.FC<ListItemProps> = () => {
  return (
    <View>
      <Text>Uzņēmuma nosaukums</Text>
    </View>
  );
};

export default ListItem;
