import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CalendarScreenProps } from "../types";

type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function CalendarScreen({ navigation }: CalendarScreenProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showPicker, setShowPicker] = useState(false);

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
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={styles.dateButton}
          >
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
