import React, { useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FormInput from "../../components/FormInput";
import { windowHeight } from "../../utils/Dimentions";

const listExistingUser = async () => {
  try {
    console.log("pull from firebase users collection");
  } catch (err) {
    console.log("error pulling existing users, ", err);
  }
};

const NewGroupScreen = () => {
  const [searchUserName, setSearchUserName] = useState("");
  const [matchedUsers, setMatchedUsers] = useState(["wxu", "ywang"]);
  return (
    <View>
      <View style={style.inputContainer}>
        <TextInput
          style={style.input}
          value={searchUserName}
          onChangeText={setSearchUserName}
          placeholder="find username"
        />
        <Button title="Go" />
      </View>

      <FlatList
        data={matchedUsers}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ width: "100%" }}>
            <View style={style.matchedUser}>
              <Text style={{ fontSize: 20 }}>{item}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
