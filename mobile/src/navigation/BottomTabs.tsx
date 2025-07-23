import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CalendarScreen from "../screens/CalendarScreen"; // Rename if needed
import  TasksScreen  from "../screens/TasksScreen";   // To be created
import { View, Text } from "react-native";
import SyncScreen from "../screens/SyncScreen"; // To be created
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

function SyncPlaceholderScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Sync screen coming soon!</Text>
    </View>
  );
}

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#3DB2FF",
        tabBarStyle: { height: 60, paddingBottom: 5 },
        tabBarIcon: ({ color, size }) => {
          let iconName = "calendar";

          if (route.name === "Calendar") iconName = "calendar-outline";
          else if (route.name === "Tasks") iconName = "list-outline";
          else if (route.name === "Sync") iconName = "sync-outline";

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Sync" component={SyncScreen} />
    </Tab.Navigator>
  );
}
