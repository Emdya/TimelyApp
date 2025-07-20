import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;
export type AddTaskScreenProps = NativeStackScreenProps<RootStackParamList, "AddTask">;
