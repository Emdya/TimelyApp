import React, { useEffect, useState } from "react";
import {
  View, Text, Switch, TextInput, StyleSheet, ScrollView, TouchableOpacity
} from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { SafeAreaView } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;



export default function SettingsScreen({ navigation }: Props){
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [leadTimes, setLeadTimes] = useState({
    High: { days: "0", hours: "1", minutes: "0" },
    Medium: { days: "0", hours: "3", minutes: "0" },
    Low: { days: "0", hours: "12", minutes: "0" },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const ref = doc(db, "settings", "default"); // in future: use user ID
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setNotificationsEnabled(data.notificationsEnabled);
        setLeadTimes(data.leadTimes);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    const ref = doc(db, "settings", "default");
    await setDoc(ref, {
      notificationsEnabled,
      leadTimes,
    });
  };

  const handleChange = (priority: string, unit: string, value: string) => {
    const updated = {
      ...leadTimes,
      [priority]: {
        ...leadTimes[priority],
        [unit]: value,
      },
    };
    setLeadTimes(updated);
    saveSettings(); // 🔄 Save to Firestore
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🔔 Notification Settings</Text>

       <TouchableOpacity
  onPress={() => navigation.goBack()}
  style={{ padding: 12, marginBottom: 10 }}
>
  <Text style={{ fontSize: 18 }}>← Back</Text>
</TouchableOpacity>

     
      <View style={styles.row}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={(value) => {
            setNotificationsEnabled(value);
            saveSettings();
          }}
        />
      </View>

      {["High", "Medium", "Low"].map((priority) => (
        <View key={priority} style={styles.prioritySection}>
          <Text style={styles.priorityTitle}>{priority} Priority</Text>
          {["days", "hours", "minutes"].map((unit) => (
            <View key={unit} style={styles.row}>
              <Text style={styles.label}>
                {unit.charAt(0).toUpperCase() + unit.slice(1)}
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={leadTimes[priority][unit]}
                onChangeText={(text) => handleChange(priority, unit, text)}
              />
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: { fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 60,
    padding: 6,
    borderRadius: 5,
    textAlign: "center",
  },
  prioritySection: {
    marginTop: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  priorityTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
});

     