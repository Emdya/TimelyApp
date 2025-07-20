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
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import * as Notifications from "expo-notifications";
import { doc, getDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddTaskScreen({ navigation }: AddTaskScreenProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

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
        dueDate: dueDate?.toISOString() || null,
      });
      // Load settings from Firestore
const settingsSnap = await getDoc(doc(db, "settings", "default"));
if (settingsSnap.exists()) {
  const settings = settingsSnap.data();

  if (settings.notificationsEnabled && dueDate) {
    const lead = settings.leadTimes?.[priority || "Medium"];
    if (lead) {
      const leadMs =
        (+lead.days || 0) * 86400000 +
        (+lead.hours || 0) * 3600000 +
        (+lead.minutes || 0) * 60000;

      const triggerTime = new Date(new Date(dueDate).getTime() - leadMs);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ ${title.trim()} is coming up!`,
          body: `Due at ${new Date(dueDate).toLocaleString()}`,
        },
        trigger: triggerTime,
      });
    }
  }
}

      alert("✅ Task added!");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding task:", error);
      alert("❌ Failed to add task");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <TouchableOpacity style={styles.button} onPress={handleAddTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
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
