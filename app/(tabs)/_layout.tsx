import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Button } from "react-native";
import { useAuth } from "../../context/auth";

const mainPage = () => {
  const router = useRouter();

  const { signOut } = useAuth();

  return (
    <Tabs>
      <Tabs.Screen
        name="lobby"
        options={{
          headerRight: () => <Button title="Logout" onPress={signOut} />,
          headerTitle: "Lobby",
        }}
      />
      <Tabs.Screen
        name="kekkai"
        options={{
          headerTitle: "Kekkai",
        }}
      />
    </Tabs>
  );
};

export default mainPage;
