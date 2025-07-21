import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import { Button, View, StyleSheet, Text } from "react-native";
import { RootStackParamList } from "./src/types";
import HomeScreen from "./src/screens/HomeScreen";
import AddTaskScreen from "./src/screens/AddTaskScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import AuthScreen from "./src/screens/AuthScreen";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./src/firebase/firebase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator<RootStackParamList>();

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
        {loading ? (
          <View style={styles.container}>
            <Text>Loading...</Text>
          </View>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
              <Stack.Screen name="Auth" component={AuthScreen} />
            ) : (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="AddTask" component={AddTaskScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="NotificationTest" component={NotificationTestScreen} />
              </>
            )}
          </Stack.Navigator>
        )}
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
