import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { HomeScreenProps } from "../types";

type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">

const sampleTasks = [
  { id: "1", title: "Finish UI design", status: "Pending", priority: "High" },
  { id: "2", title: "Write Firestore logic", status: "In Progress", priority: "Medium" },
  { id: "3", title: "Push to GitHub", status: "Completed", priority: "Low" },
];

export default function HomeScreen({navigation} : HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📋 Your Tasks</Text>

      <FlatList
        data={sampleTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskMeta}>
              {item.status} • {item.priority}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddTask")}>
        <Text style={styles.addButtonText}>+ Add Task</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  taskCard: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskTitle: { fontSize: 18, fontWeight: "600" },
  taskMeta: { fontSize: 14, color: "#666" },
  addButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});
