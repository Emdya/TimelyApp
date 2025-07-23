// src/components/Header.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Header() {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <Text style={styles.icon}>⚙️</Text>
      </TouchableOpacity>

      <View style={styles.headerTextContainer}>
        <Text style={styles.title}>Timely</Text>
        <Text style={styles.subtitle}>Stay organized, stay focused</Text>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("AddTask")}>
        <Text style={styles.icon}>➕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3DB2FF",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerTextContainer: {
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
  },
  icon: {
    fontSize: 24,
    color: "#fff",
  },
});
