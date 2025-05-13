import { Tabs } from "expo-router";
import { Text, Button, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import "@/global.css";

export default function TabLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          if (route.name === "home") iconName = "home";
          if (route.name === "chat") iconName = "chatbubble-ellipses";
          if (route.name === "glasses") iconName = "bluetooth";
          if (route.name === "games") iconName = "game-controller";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#cbd5e1",
        tabBarStyle: {
          backgroundColor: "#0f172a",
          borderTopColor: "#1e293b",
          height: 60,
          paddingBottom: 4,
        },
        headerStyle: {
          backgroundColor: "#1e293b",
        },
        headerTintColor: "#f1f5f9",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerRight: () => (
          <View className="mr-5">
            <Button title="Log out" color="#3b82f6" onPress={handleLogout} />
          </View>
        ),
        tabBarLabel: ({ focused }) => (
          <Text
            className={`text-xs ${
              focused ? "text-blue-400" : "text-slate-400"
            }`}
          >
            {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
          </Text>
        ),
      })}
    />
  );
}
