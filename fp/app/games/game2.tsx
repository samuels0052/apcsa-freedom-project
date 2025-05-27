import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import keys from "../../keys.json";

const TENOR_API_KEY = keys.TENOR;

export default function Game2() {
  const [currentMeme, setCurrentMeme] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMeme = async () => {
    setLoading(true);
    try {
      const output = await fetch(
        `https://tenor.googleapis.com/v2/search?q=funny&key=${TENOR_API_KEY}&limit=1&random=true`
      );
      const json = await output.json();
      const gif = json.results[0]?.media_formats?.gif?.url;
      setCurrentMeme(gif);
    } catch (err) {
      console.error("Failed to load meme:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeme();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-slate-900 p-4">
      <Text className="text-3xl text-white font-bold mb-4">Meme Time!</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : currentMeme ? (
        <Image
          source={{ uri: currentMeme }}
          className="w-full h-80 rounded-lg mb-6"
          resizeMode="contain"
        />
      ) : (
        <Text className="text-white mb-6">Error</Text>
      )}

      <TouchableOpacity
        onPress={fetchMeme}
        className="bg-blue-700 px-6 py-3 rounded-xl"
      >
        <Text className="text-white text-lg font-semibold">Generate!</Text>
      </TouchableOpacity>
    </View>
  );
}
