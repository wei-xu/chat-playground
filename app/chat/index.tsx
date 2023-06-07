import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatRoom = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: "Hello world",
        createdAt: new Date(),
        user: {
          _id: 1,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  const handleSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const { userName } = useLocalSearchParams();
  console.log("in chat screen, name: ", userName);

  return (
    // need to get the top level view of this page to flex as 1
    // other wise gifted chat wouldn't show up
    // I suspect there's something about gifted chat that 
    // doesn't go with other layout setting
    <SafeAreaView style={{flex: 1}}> 
      <Stack.Screen
        options={{
          headerTitle: `in chat ${userName}`,
        }}
      />
      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{ _id: 1 }}
        alwaysShowSend
      />
    </SafeAreaView>
  );
};

export default ChatRoom;
