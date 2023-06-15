import {
  Stack,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/auth";
import {
  CollectionReference,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

const ChatRoom = () => {
  const { groupId, otherUserName } = useLocalSearchParams();
  const pathname = usePathname();
  console.log(`in ${pathname}, name: ${otherUserName}`);

  const [messages, setMessages] = useState([]);

  const { user, username } = useAuth();

  useEffect(() => {
    const getGroupMessage = async (groupId) => {
      const messageCollectionRef: CollectionReference = collection(
        db,
        "groups",
        groupId,
        "messages"
      );

      console.log("message collection ref", messageCollectionRef);

      const q = await getDocs(messageCollectionRef);

      if (q.empty) {
        console.log("message of group is empty");
      } else {
        console.log("message not empty, ", q);

        
      }
    };
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

    getGroupMessage(groupId);
  }, []);

  const handleSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    // need to get the top level view of this page to flex as 1
    // other wise gifted chat wouldn't show up
    // I suspect there's something about gifted chat that
    // doesn't go with other layout setting
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: `${otherUserName}`, // TODO figure out cannot use userName directly
        }}
      />
      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{ _id: 2, name: username }} // this user _id matches the bubble on the right
        alwaysShowSend
      />
    </SafeAreaView>
  );
};

export default ChatRoom;
