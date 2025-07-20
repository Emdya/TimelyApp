import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import { Button, View, StyleSheet } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import AddTaskScreen from "./src/screens/AddTaskScreen";
import { RootStackParamList } from "./src/types";
import SettingsScreen from "./src/screens/SettingsScreen";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,  // ✅ shows banner (iOS-style)
    shouldShowList: true,    // ✅ adds to Notification Center
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});



const Stack = createNativeStackNavigator<RootStackParamList>();

// Optional: create a temporary test screen
function NotificationTestScreen() {
  const triggerNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📌 Timely Reminder",
        body: "This is your test task reminder!",
      },
      trigger: { seconds: 5 },
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Send Test Notification" onPress={triggerNotification} />
    </View>
  );
}

export default function App() {
  useEffect(() => {
  const getPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    console.log("🔐 Notification permission status:", status);
    if (status !== "granted") {
      alert("Enable notifications in system settings.");
    }
  };

  getPermissions();
}, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} />
          <Stack.Screen name="NotificationTest" component={NotificationTestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
