import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

export default function Glasses() {
  const [city, setCity] = useState("");
  const [reminder, setReminder] = useState("");
  const [lastWeatherSent, setLastWeatherSent] = useState<number | null>(null);

  const SERVER_URL = "http://192.168.1.16:3001";

  const getWeatherAndSend = async () => {
    if (!city.trim()) {
      Alert.alert("Please enter a city name.");
      return;
    }

    try {
      const res = await fetch(`https://wttr.in/${city}?format=%C|%t|%w|%v`);
      const data = await res.text();
      const [condition, rawTemp, wind, precipitation] = data.split("|");

      const temp = rawTemp.replace(/[^\d\+\-]/g, "") + " F";

      const displayText = `${condition} ${temp} ${wind} ${precipitation}`;

      const displayRes = await fetch(`${SERVER_URL}/display`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: displayText,
      });

      if (displayRes.ok) {
        setLastWeatherSent(Date.now());
      } else {
        const errorText = await displayRes.text();
        Alert.alert(errorText);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      Alert.alert(msg);
    }
  };

  const sendReminder = async () => {
    if (reminder.length > 20) {
      Alert.alert("Message must be 20 characters or fewer.");
      return;
    }

    try {
      const res = await fetch(`${SERVER_URL}/display`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: reminder,
      });

      if (res.ok) {
        setReminder("");
      } else {
        const errorText = await res.text();
        Alert.alert(errorText);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      Alert.alert(msg);
    }
  };

  useEffect(() => {
    if (lastWeatherSent === null) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - (lastWeatherSent ?? 0);
      if (elapsed >= 3600000) getWeatherAndSend();
    }, 60000);

    return () => clearInterval(interval);
  }, [lastWeatherSent]);

  return (
    <ScrollView className="flex-1 bg-blue-950 px-6 pt-10">
      <Text className="text-blue-100 text-2xl font-bold mb-4 text-center">
        Display to Glasses
      </Text>

      <View className="bg-blue-800/80 p-5 rounded-2xl border border-blue-700 mb-6">
        <Text className="text-blue-200 text-lg font-semibold mb-2">
          Weather
        </Text>
        <TextInput
          className="bg-blue-900 text-blue-100 px-4 py-2 rounded-lg mb-3 border border-blue-600"
          placeholder="Enter city"
          placeholderTextColor="#cbd5e1"
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity
          onPress={getWeatherAndSend}
          className="bg-blue-600 py-3 rounded-lg"
        >
          <Text className="text-white text-center text-base font-medium">
            Send Weather
          </Text>
        </TouchableOpacity>
      </View>

      <View className="bg-blue-800/80 p-5 rounded-2xl border border-blue-700">
        <Text className="text-blue-200 text-lg font-semibold mb-2">
          Reminder
        </Text>
        <TextInput
          className="bg-blue-900 text-blue-100 px-4 py-2 rounded-lg mb-3 border border-blue-600"
          placeholder="Enter reminder"
          placeholderTextColor="#cbd5e1"
          value={reminder}
          onChangeText={setReminder}
          multiline
        />
        <TouchableOpacity
          onPress={sendReminder}
          className="bg-blue-600 py-3 rounded-lg"
        >
          <Text className="text-white text-center text-base font-medium">
            Send Reminder
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
