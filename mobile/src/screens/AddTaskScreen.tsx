import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { AddTaskScreenProps } from "../types";

export default function AddTaskScreen({ navigation } : AddTaskScreenProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");

  const handleAddTask = () => {
    // 🔜 Replace this with Firestore write logic later
    console.log("Task added:", { title, priority });
    navigation.goBack(); // navigate back to Home after adding
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>➕ Add New Task</Text>

      <TextInput
        style={styles.input}
        placeholder="Task title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Priority (Low / Medium / High)"
        value={priority}
        onChangeText={setPriority}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
});
