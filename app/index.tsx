import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { useAuth } from "../context/auth";
import { SafeAreaView } from "react-native-safe-area-context";

const WelcomePage = () => {
  const { user } = useAuth();
  return (
    <SafeAreaView>
      <View>
        <Text>WelcomePage</Text>
        <Link href="/lobby">To Lobby</Link>

        <Link href="/kekkai">To Kekkai</Link>

        <Link href="/sign-in">Sign in</Link>

        <Link href="/chat">To Chat</Link>
      </View>
    </SafeAreaView>
  );
};

export default WelcomePage;
