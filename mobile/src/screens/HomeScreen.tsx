import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { HomeScreenProps } from "../types";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { auth } from "../firebase/firebase"; 
import { doc, updateDoc } from "firebase/firestore";
import { Swipeable } from "react-native-gesture-handler";
import { deleteDoc } from "firebase/firestore"; // already imported with doc
import DateTimePicker from "@react-native-community/datetimepicker";
import { ScrollView, SafeAreaView } from "react-native";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";







type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">




export default function HomeScreen({navigation} : HomeScreenProps) {
    const [tasks, setTasks] = useState<any[]>([]);
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [sortOption, setSortOption] = useState<"dueDate" | "priority">("dueDate");
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [showPicker, setShowPicker] = useState(false);



    useEffect(() => {
    const userId = auth.currentUser?.uid;
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"),where("userId", "==", userId));
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

  const filteredTasks = tasks.filter((task) => {
  const matchesPriority =
    priorityFilter === "All" || task.priority === priorityFilter;

  const matchesDate = selectedDate
    ? task.dueDate &&
      new Date(task.dueDate).toDateString() === selectedDate.toDateString()
    : true;

  return matchesPriority && matchesDate;
});
    const sortedTasks = [...filteredTasks].sort((a, b) => {
  if (sortOption === "dueDate") {
    const aDate = new Date(a.dueDate);
    const bDate = new Date(b.dueDate);
    return aDate.getTime() - bDate.getTime(); // Soonest first
  } else {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  }
});

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
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

      <View style={styles.dateSection}>
        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateButton}>
          <Text style={styles.dateText}>
            {selectedDate ? selectedDate.toDateString() : "Pick a date"}
          </Text>
          <Text style={styles.dateIcon}>📅</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="calendar"
            onChange={(event, selected) => {
              setShowPicker(false);
              if (selected) setSelectedDate(selected);
            }}
          />
        )}
      </View>

      <View style={styles.container}>
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            onPress={() => setSortOption("dueDate")}
            style={[
              styles.sortButton,
              sortOption === "dueDate" && styles.sortButtonActive,
            ]}
          >
            <Text style={styles.sortButtonText}>Due Date</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortOption("priority")}
            style={[
              styles.sortButton,
              sortOption === "priority" && styles.sortButtonActive,
            ]}
          >
            <Text style={styles.sortButtonText}>Priority</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.settingsButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>📋 Your Tasks</Text>

        <View style={styles.filterContainer}>
          {["All", "High", "Medium", "Low"].map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => setPriorityFilter(level)}
              style={[
                styles.filterButton,
                priorityFilter === level && styles.filterButtonActive,
              ]}
            >
              <Text style={styles.filterButtonText}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>

    {/* ✅ FlatList lives OUTSIDE the ScrollView */}
    <FlatList
      data={sortedTasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Swipeable renderRightActions={() => renderRightActions(item.id)}>
          <TouchableOpacity
            style={[
              styles.taskCard,
              item.status === "Completed" && styles.completedCard,
            ]}
            onPress={() => toggleTaskStatus(item.id, item.status)}
            onLongPress={() => navigation.navigate("AddTask", { task: item })}
          >
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskMeta}>
              {item.status} • {item.priority}
            </Text>
            <Text style={styles.dueText}>
              Due: {item.dueDate ? new Date(item.dueDate).toLocaleString() : "N/A"}
            </Text>
          </TouchableOpacity>
        </Swipeable>
      )}
      style={{ marginBottom: 100 }}
    />

    {/* ✅ Add Task Button (keep this or replace with a FAB later) */}
    <TouchableOpacity
      style={styles.addButton}
      onPress={() => navigation.navigate("AddTask")}
    >
      <Text style={styles.addButtonText}>+ Add Task</Text>
    </TouchableOpacity>
  </SafeAreaView>
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
dueText: {
  fontSize: 14,
  color: "#999",
  marginTop: 4,
},
deleteButtonText: {
  color: "white",
  fontWeight: "bold",
},
filterContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 15,
},
filterButton: {
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 20,
  backgroundColor: "#eee",
},
settingsButton: {
  alignSelf: "flex-end",
  marginBottom: 10,
  padding: 8,
  borderRadius: 8,
  backgroundColor: "#eee",
},
settingsButtonText: {
  fontSize: 14,
  fontWeight: "600",
},
filterButtonActive: {
  backgroundColor: "#4CAF50",
},
filterButtonText: {
  color: "#333",
  fontWeight: "600",
},
sortContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
},
sortLabel: {
  fontSize: 16,
  fontWeight: "600",
},
sortButton: {
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 20,
  backgroundColor: "#eee",
},
sortButtonActive: {
  backgroundColor: "#4CAF50",
},
sortButtonText: {
  color: "#333",
  fontWeight: "600",
},
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
dateSection: {
  paddingHorizontal: 16,
  marginBottom: 15,
},
dateButton: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottomWidth: 1,
  borderColor: "#ccc",
  paddingBottom: 8,
},
dateText: {
  fontSize: 16,
  color: "#333",
},
dateIcon: {
  fontSize: 20,
  color: "#333",
},

});
