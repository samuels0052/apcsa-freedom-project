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

      const data = await fetchUserWithUID(uid);
      if (data) {
        setData({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          pfp: data.pfp,
          about: data.about,
        });
      }
    };

    renderData();
  }, []);

  return (
    <View className="p-20 items-center justify-center">
      {data ? (
        <>
          <Image
            source={{ uri: data.pfp }}
            className="w-24 h-24 rounded-full mb-4"
          />
          <Text className="text-xl font-bold text-red-500">
            {data.username}
          </Text>
          <Text className="text-xl font-bold mb-5">
            {data.firstName} {data.lastName}
          </Text>
          <Text className="text-xl font-bold">About Me:</Text>
          {data.about ? (
            <Text className="text-lg font-bold">{data.about}</Text>
          ) : (
            <Text className="text-lg font-bold">No about section.</Text>
          )}
        </>
      ) : (
        <Text className="text-lg mb-4">Loading user :)</Text>
      )}
    </View>
  );
}
