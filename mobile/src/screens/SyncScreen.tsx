import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import Header from "../components/Header";

export default function SyncScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.heading}>🔄 Sync Calendar</Text>
        <Text style={styles.description}>
          This is where your external calendar integrations will live.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
