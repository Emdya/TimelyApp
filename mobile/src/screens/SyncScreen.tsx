import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import Header from "../components/Header";

export default function SyncScreen() {
  const [activeTab, setActiveTab] = useState<"shared" | "availability">("shared");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const renderTabContent = () => {
    if (activeTab === "shared") {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>📅 Shared Calendars</Text>
          {/* Placeholder for shared calendar cards */}
          <Text>Coming soon: list of synced calendars</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>⏰ Group Availability</Text>
          {/* Placeholder for availability results */}
          <Text>Coming soon: best meeting times for all members</Text>
        </View>
      );
    }
  };

  const handleInvite = () => {
    console.log("Invite sent to:", inviteEmail);
    setShowInviteModal(false);
    setInviteEmail("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "shared" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("shared")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "shared" && styles.activeTabText,
            ]}
          >
            Shared Calendar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "availability" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("availability")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "availability" && styles.activeTabText,
            ]}
          >
            Availability
          </Text>
        </TouchableOpacity>
      </View>

      {/* "+" Invite button */}
      <TouchableOpacity
        style={styles.floatingPlus}
        onPress={() => setShowInviteModal(true)}
      >
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>

      {/* Tab-specific content */}
      {renderTabContent()}

      {/* Invite Modal */}
      <Modal visible={showInviteModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Invite to Calendar</Text>
            <Text style={styles.modalLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Email Here"
              value={inviteEmail}
              onChangeText={setInviteEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowInviteModal(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleInvite}
              >
                <Text style={{ color: "#fff" }}>Send Invite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    alignItems: "center",
  },
  activeTab: {
    borderBottomColor: "#3DB2FF",
  },
  tabText: {
    fontSize: 16,
    color: "#555",
  },
  activeTabText: {
    color: "#3DB2FF",
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  floatingPlus: {
    position: "absolute",
    right: 20,
    top: 90,
    backgroundColor: "#3DB2FF",
    borderRadius: 30,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  plusText: {
    fontSize: 30,
    color: "#fff",
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#2294f2",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});

