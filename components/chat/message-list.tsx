import { View, Text, FlatList } from "react-native";
import React from "react";
import Message from "./message";

const ItemSeparatorView = () => {
  return (
    // Flat List Item Separator
    <View
      style={{
        height: 0.5,
        width: '100%',
        backgroundColor: '#C8C8C8',
      }}
    />
  );
};
const MessageList = ({ messageList }) => {
  console.log(messageList)
  return (
    <FlatList
      data={messageList}
      renderItem={({ item }) => <Message msg={item} />}
      ItemSeparatorComponent={ItemSeparatorView}
    />
  );
};

export default MessageList;
