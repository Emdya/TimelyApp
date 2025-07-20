import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { AddTaskScreenProps } from "../types";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";


export default function AddTaskScreen({ navigation } : AddTaskScreenProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");

 const handleAddTask = async () => {
  if (!title.trim()) {
    alert("Please enter a task title");
    return;
  }

  try {
    await addDoc(collection(db, "tasks"), {
      title: title.trim(),
      priority: priority || "Medium",
      status: "Pending",
      createdAt: new Date(),
    });

    alert("✅ Task added!");
    navigation.goBack();
  } catch (error) {
    console.error("Error adding task:", error);
    alert("❌ Failed to add task");
  }
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
