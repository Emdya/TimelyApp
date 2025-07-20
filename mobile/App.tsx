import { StatusBar } from 'expo-status-bar';
import { Text, View } from "react-native";
import { db } from "./src/firebase/firebase";
import { StyleSheet } from "react-native";



export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>✅ Firebase is connected</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
