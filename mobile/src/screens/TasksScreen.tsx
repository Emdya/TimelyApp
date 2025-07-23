import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import Header from "../components/Header";

export default function TasksScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Tasks Page Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
}
