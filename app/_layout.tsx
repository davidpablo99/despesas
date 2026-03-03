import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { DatabaseProvider } from "../src/database/DatabaseProvider";
import { Colors } from "../src/constants/Colors";

export default function Layout() {
  return (
    <View style={styles.container}>
      <DatabaseProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            contentStyle: {
              backgroundColor: Colors.background,
            },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="add"
            options={{ title: "Nova Transação", presentation: "modal" }}
          />
        </Stack>
      </DatabaseProvider>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
