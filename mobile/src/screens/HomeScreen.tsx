import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { HomeScreenProps } from "../types";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Swipeable } from "react-native-gesture-handler";
import { deleteDoc } from "firebase/firestore"; // already imported with doc



type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">




export default function HomeScreen({navigation} : HomeScreenProps) {
    const [tasks, setTasks] = useState<any[]>([]);

    useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
    });
      return unsubscribe; // Cleanup on unmount
  }, []);
  const deleteTask = async (taskId: string) => {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
    console.log(`🗑 Task ${taskId} deleted`);
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Failed to delete task.");
  }
};
const renderRightActions = (taskId: string) => {
  return (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => deleteTask(taskId)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );
};

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
  const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";

  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { status: newStatus });
    console.log(`Task ${taskId} marked as ${newStatus}`);
  } catch (error) {
    console.error("Error updating task status:", error);
    alert("Failed to update task.");
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📋 Your Tasks</Text>

      <FlatList
        data={tasks}

        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
  <Swipeable renderRightActions={() => renderRightActions(item.id)}>
    <TouchableOpacity
      style={[
        styles.taskCard,
        item.status === "Completed" && styles.completedCard,
      ]}
      onPress={() => toggleTaskStatus(item.id, item.status)}
    >
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskMeta}>
        {item.status} • {item.priority}
      </Text>
    </TouchableOpacity>
  </Swipeable>
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
    completedCard: {
    backgroundColor: "#d9ffd9", // soft green
  },
  deleteButton: {
  backgroundColor: "#ff4d4d",
  justifyContent: "center",
  alignItems: "flex-end",
  padding: 20,
  borderRadius: 10,
  marginBottom: 10,
},
deleteButtonText: {
  color: "white",
  fontWeight: "bold",
},
});
