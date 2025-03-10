import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { auth } from "../firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { View, ActivityIndicator, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../global.css";

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const segments = useSegments();

  const handleAuthStateChange = (currentUser: any) => {
    setUser(currentUser);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
    return unsubscribe;
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
      AsyncStorage.clear().catch(() => {});
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
  }, []);

  if (initializing) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen name="index" options={{ title: "Freedom Project" }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
