import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AddTaskScreenProps } from "../types";
import { addDoc, collection, updateDoc } from "firebase/firestore"; // Make sure updateDoc is imported
import { db } from "../firebase/firebase";
import * as Notifications from "expo-notifications";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../firebase/firebase"; // if not already imported
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native";

export default function AddTaskScreen({ navigation, route }: AddTaskScreenProps) {
  const { task } = route.params || {};
  const [title, setTitle] = useState( task?.title || "");
  const [priority, setPriority] = useState(task?.priority || "");
  const [sortOption, setSortOption] = useState<"dueDate" | "priority">("dueDate");
  const [dueDate, setDueDate] = useState<Date | null>(() => {
  if (!task?.dueDate) return null;

  const parsed = new Date(task.dueDate);
  return isNaN(parsed.getTime()) ? null : parsed;
});
  const [showPicker, setShowPicker] = useState(false);

  const handleSaveTask = async () => {
  if (!title.trim()) {
    alert("Please enter a task title");
    return;
  }

  try {
    // 🔍 Safely parse createdAt (handles Firestore Timestamps, strings, and nulls)
    let parsedCreatedAt: Date;
    if (task?.createdAt?.toDate) {
      parsedCreatedAt = task.createdAt.toDate(); // Firestore Timestamp
    } else if (typeof task?.createdAt === "string") {
      parsedCreatedAt = new Date(task.createdAt); // ISO string
    } else {
      parsedCreatedAt = new Date(task?.createdAt ?? Date.now()); // fallback
    }

    if (isNaN(parsedCreatedAt.getTime())) {
      parsedCreatedAt = new Date(); // fallback to now if invalid
    }

    // 🔐 Build Firestore payload
    const payload = {
      title: title.trim(),
      priority: priority || "Medium",
      status: task?.status || "Pending",
      createdAt: parsedCreatedAt,
      dueDate: dueDate instanceof Date && !isNaN(dueDate.getTime())
        ? dueDate.toISOString()
        : null,
        userId: auth.currentUser?.uid, // ✅ attach the current user's ID
    };

    let taskId = task?.id;

    if (taskId) {
      await updateDoc(doc(db, "tasks", taskId), payload);
    } else {
    console.log("🚀 Payload being saved:", payload);
      const ref = await addDoc(collection(db, "tasks"), payload);
      taskId = ref.id;
    }

    // ⏰ Schedule notification
    const settingsSnap = await getDoc(doc(db, "settings", "default"));
    if (settingsSnap.exists() && dueDate) {
      const settings = settingsSnap.data();

      if (settings.notificationsEnabled) {
        const lead = settings.leadTimes?.[priority || "Medium"];
        if (lead) {
          const leadMs =
            (+lead.days || 0) * 86400000 +
            (+lead.hours || 0) * 3600000 +
            (+lead.minutes || 0) * 60000;

          const dueTime = new Date(dueDate);
          if (!isNaN(dueTime.getTime())) {
            const triggerTime = new Date(dueTime.getTime() - leadMs);

            if (isNaN(triggerTime.getTime()) || triggerTime <= new Date()) {
  console.warn("⏰ Skipping notification — trigger time is invalid or in the past");
} else {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `⏰ ${title.trim()} is coming up!`,
      body: `Due at ${dueDate.toLocaleString()}`,
    },
    trigger: {
      type: "date",
      date: triggerTime,
    },
  });
}


          }
        }
      }
    }

    alert(taskId ? "✅ Task updated!" : "✅ Task added!");
    navigation.goBack();
  } catch (error) {
    console.error("❌ Error saving task:", error);
    alert("❌ Failed to save task");
  }
};

  
     

    
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{task ? " Edit Task" : "➕ Add New Task"}</Text>

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

      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.datePicker}>
        <Text>
          {dueDate ? dueDate.toLocaleString() : "Pick Due Date & Time"}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDueDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSaveTask}>
  <Text style={styles.buttonText}>{task ? "Update Task" : "Add Task"}</Text>
</TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, 
    paddingTop: 40
  },

  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  datePicker: {
    padding: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
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
