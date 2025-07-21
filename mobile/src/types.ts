import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  AddTask: { task?:any }; // Optional task for editing
  Settings: undefined;
  NotificationTest: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;
export type AddTaskScreenProps = NativeStackScreenProps<RootStackParamList, "AddTask">;
