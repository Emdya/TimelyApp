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
import { getDocs } from "firebase/firestore";
import * as Notifications from "expo-notifications";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../firebase/firebase"; // if not already imported
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // for cancel icon

export default function AddTaskScreen({ navigation, route }: AddTaskScreenProps) {
  const { task } = route.params || {};
  const [title, setTitle] = useState( task?.title || "");
  const [priority, setPriority] = useState(task?.priority || "");
 
  

  const [dueDate, setDueDate] = useState<Date | null>(() => {
  if (!task?.dueDate) return null;
  const parsed = new Date(task.dueDate);
  return isNaN(parsed.getTime()) ? null : parsed;
});
const [sortOption, setSortOption] = useState<"dueDate" | "priority">("dueDate");
const [categories, setCategories] = useState<string[]>([]);
const [selectedCategory, setSelectedCategory] = useState(task?.category || "");

  const [showPicker, setShowPicker] = useState<"date" | "time" | null>(null);

  React.useEffect(() => {
  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "categories"));
      const categoryList = snapshot.docs.map(doc => doc.data().name); // assumes each doc has a "name" field
      setCategories(categoryList);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  fetchCategories();
}, []);

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
        userId: auth.currentUser?.uid, //  attach the current user's ID
        category: selectedCategory || "",

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
      <View style={styles.headerBar}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Ionicons name="close" size={30} color="white" />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>{task ? "Edit Task" : "New Task"}</Text>

  <TouchableOpacity onPress={handleSaveTask} style={styles.saveButton}>
    <Text style={styles.saveButtonText}>Save</Text>
  </TouchableOpacity>
</View>

    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{task ? " Edit Task" : "➕ Add New Task"}</Text>

      <View style={styles.section}>
  <Text style={styles.label}>Task Title *</Text>
  <TextInput
    style={styles.input}
    placeholder="Enter Task Title"
    value={title}
    onChangeText={setTitle}
  />
</View>

<View style={styles.section}>
  <View style={styles.section}>
  <Text style={styles.label}>Priority Level</Text>
  <View style={styles.priorityRow}>
    {["Low", "Medium", "High"].map((level) => (
      <TouchableOpacity
        key={level}
        style={[
          styles.priorityButton,
          priority === level && styles.priorityButtonActive,
        ]}
        onPress={() => setPriority(level)}
      >
        <Text
          style={[
            styles.priorityButtonText,
            priority === level && styles.priorityButtonTextActive,
          ]}
        >
          {level}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
  <View style={styles.section}>
  <Text style={styles.label}>Category</Text>
  <View style={styles.priorityRow}>
    {categories.length > 0 ? (
      categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[
            styles.priorityButton,
            selectedCategory === cat && styles.priorityButtonActive,
          ]}
          onPress={() => setSelectedCategory(cat)}
        >
          <Text
            style={[
              styles.priorityButtonText,
              selectedCategory === cat && styles.priorityButtonTextActive,
            ]}
          >
            {cat}
          </Text>
        </TouchableOpacity>
      ))
    ) : (
      <Text style={{ color: "#999" }}>No categories found</Text>
    )}
  </View>
</View>
  <View style={styles.section}>
  <Text style={styles.label}>Due Date & Time</Text>
  <View style={styles.datetimeRow}>
    <TouchableOpacity
      onPress={() => setShowPicker("date")}
      style={styles.datetimeBox}
    >
      <Text style={styles.datetimeText}>
        {dueDate ? dueDate.toDateString() : "Pick Date"}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => setShowPicker("time")}
      style={styles.datetimeBox}
    >
      <Text style={styles.datetimeText}>
        {dueDate ? dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Pick Time"}
      </Text>
    </TouchableOpacity>
  </View>

  {showPicker === "date" && (
    <DateTimePicker
      value={dueDate || new Date()}
      mode="date"
      display="default"
      onChange={(event, selectedDate) => {
        setShowPicker(null);
        if (selectedDate && dueDate) {
          const updated = new Date(dueDate);
          updated.setFullYear(selectedDate.getFullYear());
          updated.setMonth(selectedDate.getMonth());
          updated.setDate(selectedDate.getDate());
          setDueDate(updated);
        } else if (selectedDate) {
          setDueDate(selectedDate);
        }
      }}
    />
  )}

  {showPicker === "time" && (
    <DateTimePicker
      value={dueDate || new Date()}
      mode="time"
      display="default"
      onChange={(event, selectedTime) => {
        setShowPicker(null);
        if (selectedTime && dueDate) {
          const updated = new Date(dueDate);
          updated.setHours(selectedTime.getHours());
          updated.setMinutes(selectedTime.getMinutes());
          setDueDate(updated);
        } else if (selectedTime) {
          setDueDate(selectedTime);
        }
      }}
    />
  )}
</View>

</View>

</View>


      
      

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
  
  headerBar: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#3DB2FF",
  paddingTop: 50,
  paddingHorizontal: 20,
  paddingBottom: 15,
  borderBottomWidth: 1,
  borderColor: "#ccc",
},

headerTitle: {
  fontSize: 22,
  fontWeight: "bold",
  color: "white",
},

saveButton: {
  backgroundColor: "#2294f2",
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 10,
},

saveButtonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
},
section: {
  marginBottom: 20,
},

label: {
  fontSize: 16,
  fontWeight: "600",
  marginBottom: 6,
},
priorityRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 8,
},

priorityButton: {
  flex: 1,
  paddingVertical: 10,
  marginHorizontal: 4,
  backgroundColor: "#f2f2f2",
  borderRadius: 8,
  alignItems: "center",
},

priorityButtonActive: {
  backgroundColor: "#4CAF50",
},

priorityButtonText: {
  color: "#333",
  fontWeight: "600",
},

priorityButtonTextActive: {
  color: "#fff",
},
datetimeRow: {
  flexDirection: "row",
  justifyContent: "space-between",
},

datetimeBox: {
  flex: 1,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  paddingVertical: 12,
  paddingHorizontal: 10,
  marginHorizontal: 4,
  alignItems: "center",
},

datetimeText: {
  fontSize: 16,
  color: "#333",
},

});
