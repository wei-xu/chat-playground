import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuth } from "../../context/auth";

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
  const router = useRouter();
  const { user } = useAuth();
  console.log("in message group screen, user: ", user);
  return (
    <View style={styles.container}>
      <FlatList
        data={Messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: `/chat`,
                params: { userName: item.userName },
              })
            }
          >
            <View style={styles.userInfo}>
              <View style={styles.userImgWrapper}>
                <Image style={styles.userImg} source={item.userImg} />
              </View>
              <View style={styles.textSelection}>
                <View style={styles.userInfoText}>
                  <Text style={styles.username}>{item.userName}</Text>
                  <Text style={styles.postTime}>{item.messageTime}</Text>
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
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },

  card: {
    // width: '100%',
    flex: 1,
    flexDirection: "row",
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
    padding: 15,
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
    fontFamily: "Lato-Regular",
  },
  postTime: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Lato-Regular",
  },
  messageText: {
    fontSize: 14,
    color: "#333333",
  },
});
