import { useRouter } from "expo-router";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../../config/FirebaseConfig";
import { useAuth } from "../../context/auth";
import { windowHeight } from "../../utils/Dimentions";

const listExistingUser = async () => {
  try {
    console.log("pull from firebase users collection");
  } catch (err) {
    console.log("error pulling existing users, ", err);
  }
};


const NewGroupScreen = () => {
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
  const { user, username } = useAuth();

  console.log("in new group page with username ", username);

  const searchUser = async () => {
    if (user == null) {
      console.log("searching username but current user is null");
      return null;
    }
    try {
      console.log("searching for ", searchUserName);
      const ref = doc(db, "users", searchUserName);
      const snap = await getDoc(ref); // await waits for promise to get resolved

      /*
      TODO need to put all of this in a transaction to prevent race condition
      or find another way to scale
      */

      if (snap.exists()) {
        setSearchError("");

        return ref.id;
      } else if (username === searchUserName) {
        setSearchError("cannot create chat with yourself");
        return null;
      } else {
        console.log("snap doesn't exists");
        setSearchError("user doesn't exist");
        return null;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createGroup = async () => {
    const participant = await searchUser();
    if (participant === null) {
      return;
    }

    console.log("participant: ", participant);
    //
    const newGroupRef = await addDoc(collection(db, "groups"), {
      created_at: new Date(),
      creator: username,
      members: [username, searchUserName],
      group_name: searchUserName,
      messages: [],
      last_message_at: null
    });

    // insert this group id under this user db
    // this part of creating probably needs more consistency
    // to fight against race condition than firestore can
    // offer
    const userRef = doc(db, "users", username);

    // add this new group to the user
    await updateDoc(userRef, {
      groups: arrayUnion(newGroupRef.id),
    });

    // add this new group to the other participant
    // note only private message is allowed at the moment
    const participantRef = doc(db, "users", participant);

    console.log("adding to participant id: ", participant);
    await updateDoc(participantRef, {
      groups: arrayUnion(newGroupRef.id),
    });

    console.log("a new group created with id: ", newGroupRef.id);
    router.replace({
      pathname: "/lobby",
      params: { new_group: newGroupRef.id },
    });
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
        <Button title="Go" onPress={createGroup} />
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
