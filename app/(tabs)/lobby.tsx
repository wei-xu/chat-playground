import { useLocalSearchParams, useRouter } from "expo-router";
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../config/FirebaseConfig";
import { useAuth } from "../../context/auth";

import { useEffect, useState } from "react";

const avatarMap = {
  wxu: require("../../assets/users/user-1.jpg"),
  toweixu: require("../../assets/users/user-7.jpg"),
};

const DEFAULT_IMG = require("../../assets/users/user-3.jpg");

const Messages = [
  {
    id: "1",
    userName: "Jenny Doe",
    userImg: require("../../assets/users/user-3.jpg"),
    messageTime: "4 mins ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "2",
    userName: "John Doe",
    userImg: require("../../assets/users/user-1.jpg"),
    messageTime: "2 hours ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "3",
    userName: "Ken William",
    userImg: require("../../assets/users/user-4.jpg"),
    messageTime: "1 hours ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "4",
    userName: "Selina Paul",
    userImg: require("../../assets/users/user-6.jpg"),
    messageTime: "1 day ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "5",
    userName: "Christy Alex",
    userImg: require("../../assets/users/user-7.jpg"),
    messageTime: "2 days ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
];

const MessagesScreen = () => {
  const params = useLocalSearchParams();
  console.log("groups params ", params);

  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const { username } = useAuth();

  useEffect(() => {
    console.log("test useEffect");

    async function getGroupList() {
      const groups = await getDoc(doc(db, "users", username));
      if (groups.exists()) {
        const groupList: Array<string> = groups.data().groups;
        console.log("group list: ", groupList);
        return groupList;
      } else {
        return [];
      }
    }

    async function getDetailedGroupList() {
      const groupList = await getGroupList();

      const q = query(
        collection(db, "groups"),
        where(documentId(), "in", groupList)
      );

      const snap = await getDocs(q);

      const arr = [];
      snap.forEach((doc) => {
        console.log("group chat: ", doc.data());
        arr.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log("arr: ", arr);
      setMessages(arr);
      console.log("messages: ", messages);
    }

    getDetailedGroupList();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: `/chat`,
                params: { otherUserName: item.group_name, groupId: item.id },
              })
            }
          >
            <View style={styles.userInfo}>
              <View style={styles.userImgWrapper}>
                <Image style={styles.userImg} source={avatarMap[item.group_name] || DEFAULT_IMG} />
              </View>
              <View style={styles.textSelection}>
                <View style={styles.userInfoText}>
                  <Text style={styles.username}>{item.group_name}</Text>
                  <Text style={styles.postTime}>{"1 hour ago"}</Text>
                </View>
                <Text style={styles.messageText}>{item.messageText}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },

  card: {
    width: "100%",
  },

  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  userImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  userImgWrapper: {
    paddingTop: 15,
    paddingBottom: 15,
  },

  textSelection: {
    flexDirection: "column",
    justifyContent: "center",
    // padding: 15,
    marginLeft: 10,
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  userInfoText: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  username: {
    fontSize: 12,
    fontWeight: "bold",
    // fontFamily: "Lato-Regular",
  },
  postTime: {
    fontSize: 12,
    color: "#666",
    // fontFamily: "Lato-Regular",
  },
  messageText: {
    fontSize: 14,
    color: "#333333",
  },
});
