import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { auth } from "@/firebase";
import { fetchUserWithUID } from "@/utils/fetchUserData";

export default function Home() {
  const [data, setData] = useState<{
    firstName: string;
    lastName: string;
    username: string;
    pfp: string;
    about: string;
  } | null>(null);

  useEffect(() => {
    const renderData = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const userData = await fetchUserWithUID(uid);
      if (userData) {
        setData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          pfp: userData.pfp,
          about: userData.about,
        });
      }
    };

    renderData();
  }, []);

  return (
    <View className="flex-1 bg-blue-950 items-center justify-center px-6">
      {data ? (
        <View className="bg-blue-800/80 border border-blue-700 rounded-2xl shadow-xl p-6 w-full max-w-md items-center">
          <Image
            source={{ uri: data.pfp }}
            className="w-24 h-24 rounded-full mb-4 border-2 border-blue-400"
          />
          <Text className="text-xl font-semibold text-blue-100 mb-1">
            @{data.username}
          </Text>
          <Text className="text-lg text-blue-200 mb-4">
            {data.firstName} {data.lastName}
          </Text>

          <Text className="text-base font-medium text-blue-300 mb-1">
            About Me
          </Text>
          <Text className="text-sm text-blue-100 text-center">
            {data.about || "No about section provided."}
          </Text>
        </View>
      ) : (
        <Text className="text-lg text-blue-200">Loading user...</Text>
      )}
    </View>
  );
}
