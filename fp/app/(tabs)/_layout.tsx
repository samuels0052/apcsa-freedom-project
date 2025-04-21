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
          if (route.name === "resources") iconName = "book";
          if (route.name === "games") iconName = "game-controller";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "gray",
        headerTitle: route.name.charAt(0).toUpperCase() + route.name.slice(1),
        headerRight: () => (
          <View className="mr-5">
            <Button title="Log out" onPress={handleLogout} />
          </View>
        ),
        tabBarLabel: ({ focused }) => (
          <Text
            className={`text-xs ${focused ? "text-red-600" : "text-gray-600"}`}
          >
            {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
          </Text>
        ),
        tabBarStyle: {
          backgroundColor: "#fff",
          paddingBottom: 4,
          height: 60,
        },
      })}
    />
  );
}
