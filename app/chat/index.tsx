import { Stack, useLocalSearchParams, usePathname } from "expo-router";
import {
  CollectionReference,
  Timestamp,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../config/FirebaseConfig";
import { useAuth } from "../../context/auth";

const ChatRoom = () => {
  const { groupId, otherUserName } = useLocalSearchParams();
  const pathname = usePathname();
  console.log(`in ${pathname}, name: ${otherUserName}`);

  const [messages, setMessages] = useState([]);

  const { user, username } = useAuth();

  const messageCollectionRef = collection(
    db,
    "groups",
    groupId as string,
    "messages"
  );

  const originalMessage = [
    {
      _id: 1,
      text: "Hello developer",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "React Native",
        // avatar: "https://placeimg.com/140/140/any",
      },
    },
    {
      _id: 2,
      text: "Hello world",
      createdAt: new Date(),
      user: {
        _id: username,
        name: "toweixu",
        // avatar: "https://placeimg.com/140/140/any",
      },
    },
  ];

  useEffect(() => {
    const getGroupAllMessages = async (groupId) => {
      console.log("message collection ref", messageCollectionRef);

      const q = await getDocs(messageCollectionRef);

      if (q.empty) {
        console.log("message of group is empty");
      } else {
        console.log("message not empty");

        const q = query(messageCollectionRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const messageList = querySnapshot.docs.map((doc) => {
            console.log("doc data: ", doc.data());
            const firebaseData = doc.data();
            const data = {
              _id: doc.id,
              text: firebaseData.text,
              createdAt: firebaseData.createdAt.toDate(),
              user: {
                _id: firebaseData.user._id,
                name: firebaseData.user.name
              },
            };

            return data;
          });


          setMessages(messageList);
        });
      }
    };
    getGroupAllMessages(groupId);
  }, []);

  // const handleSend = useCallback((messages = []) => {
  //   setMessages((previousMessages) =>
  //     GiftedChat.append(previousMessages, messages)
  //   );
  // }, []);

  const handleSend = async (newMessage) => {
    console.log(newMessage);
    const newMessageRef = await addDoc(messageCollectionRef, newMessage[0]);
    console.log(`new message ref id: ${newMessageRef.id}`);
  };

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
        onSend={(message) => handleSend(message)} // IMessage contains id, text, user param below
        user={{ _id: username, name: username }} // this user _id matches the bubble on the right
        alwaysShowSend
      />
    </SafeAreaView>
  );
};

export default ChatRoom;
