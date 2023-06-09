import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../config/FirebaseConfig";
import { windowHeight } from "../../utils/Dimentions";
import { useAuth } from "../../context/auth";
import { useLocalSearchParams, useRouter } from "expo-router";

const listExistingUser = async () => {
  try {
    console.log("pull from firebase users collection");
  } catch (err) {
    console.log("error pulling existing users, ", err);
  }
};

const NewGroupScreen = () => {
  const params = useLocalSearchParams();
  console.log("new group params ", params);
  const router = useRouter();
  const [searchUserName, setSearchUserName] = useState("");
//   const [matchedUsers, setMatchedUsers] = useState(["wxu", "ywang"]);

  const [searchError, setSearchError] = useState("");
  /*
  fun thing when using this hook, 
  if you put this hook inside the async function below
  you break the rule of hook
  rule of thumb always call hook in a determined env
  */
  const { user } = useAuth();

  const searchingUser = async () => {
    // if (user == null) {
    //   console.log("searching username but current user is null");
    //   return;
    // }
    // console.log("starting searching user");
    console.log("searching for ", searchUserName);
    const ref = doc(db, "users", searchUserName);
    try {
      const snap = await getDoc(ref); // await waits for promise to get resolved

      if (snap.exists()) {
        setSearchError("");
        router.replace({
          pathname: "/lobby",
          params: { new_group: snap.data().firebase_uid },
        });
      } else {
        console.log("snap doesn't exists");
        setSearchError("user doesn't exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View>
      <View style={style.inputContainer}>
        <TextInput
          style={style.input}
          value={searchUserName}
          onChangeText={setSearchUserName}
          placeholder="find username"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Button title="Go" onPress={searchingUser} />
      </View>
      {searchError === "" ? <></> : <Text> {searchError} </Text>}
      {/* <FlatList
        data={matchedUsers}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ width: "100%" }}>
            <View style={style.matchedUser}>
              <Text style={{ fontSize: 20 }}>{item}</Text>
            </View>
          </TouchableOpacity>
        )}
      /> */}
    </View>
  );
};

const style = StyleSheet.create({
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: "100%",
    height: windowHeight / 15,
    borderColor: "#ccc",
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    fontFamily: "Lato-Regular",
    color: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  matchedUser: {
    justifyContent: "center",
    // padding: 15,
    marginLeft: 20,
    width: 300,
    margin: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
});

export default NewGroupScreen;
