import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Header from "../components/Header";
import { Swipeable } from "react-native-gesture-handler";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export default function TasksScreen() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOption, setSortOption] = useState<"dueDate" | "priority">("dueDate");

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    const q = query(
      collection(db, "tasks"),
      orderBy("createdAt", "desc"),
      where("userId", "==", userId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
    });
    return unsubscribe;
  }, []);

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
    } catch (error) {
      alert("Failed to delete task.");
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { status: newStatus });
    } catch (error) {
      alert("Failed to update task.");
    }
  };

  const renderRightActions = (taskId: string) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => deleteTask(taskId)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  const filteredTasks = tasks.filter((task) => {
    return priorityFilter === "All" || task.priority === priorityFilter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />
      <View style={styles.container}>
        <Text style={styles.heading}>📋 Your Tasks</Text>

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
              >
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskMeta}>
                  {item.status} • {item.priority}
                </Text>
                <Text style={styles.dueText}>
                  Due:{" "}
                  {item.dueDate
                    ? new Date(item.dueDate).toLocaleString()
                    : "N/A"}
                </Text>
              </TouchableOpacity>
            </Swipeable>
          )}
          style={{ marginBottom: 100 }}
        />
      </View>
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
  completedCard: {
    backgroundColor: "#d9ffd9",
  },
  taskTitle: { fontSize: 18, fontWeight: "600" },
  taskMeta: { fontSize: 14, color: "#666" },
  dueText: { fontSize: 14, color: "#999", marginTop: 4 },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButtonText: { color: "white", fontWeight: "bold" },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sortLabel: { fontSize: 16, fontWeight: "600" },
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
  filterButtonActive: {
    backgroundColor: "#4CAF50",
  },
  filterButtonText: {
    color: "#333",
    fontWeight: "600",
  },
});
