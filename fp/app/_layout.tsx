import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { View, ActivityIndicator, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "@/global.css";

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const loggedOut = auth().onAuthStateChanged(onAuthStateChanged);
    return loggedOut;
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (user && !inAuthGroup) {
      router.replace("/(auth)/home");
      router.setParams({});
    } else if (!user && inAuthGroup) {
      router.replace("/");
      router.setParams({});
    }
  }, [user, initializing]);

  useEffect(() => {
    if (segments[0] === "(auth)" && !user) {
      router.replace("/");
    }
  }, [segments]);

  useEffect(() => {
    const handleBackPress = () => {
      AsyncStorage.clear().catch((error) =>
        console.log("Error clearing storage:", error)
      );
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
  }, []);

  if (initializing)
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <Stack screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen name="index" options={{ title: "Freedom Project" }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
