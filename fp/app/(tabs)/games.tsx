import { useState } from "react";
import { View, Text, Pressable, ScrollView, Modal, Button } from "react-native";
import Game1 from "../games/game1";
import Game2 from "../games/game2";
import Game3 from "../games/game3";

export default function Games() {
  const [activeGame, setActiveGame] = useState<
    null | "game1" | "game2" | "game3"
  >(null);

  const closeModal = () => setActiveGame(null);

  return (
    <ScrollView className="bg-slate-900 flex-1 px-4 pt-6">
      <Text className="text-2xl text-slate-100 font-bold mb-6">Games Page</Text>

      <Pressable onPress={() => setActiveGame("game1")} className="mb-4">
        <View className="bg-blue-800 p-5 rounded-xl shadow-lg">
          <Text className="text-slate-100 text-lg font-semibold">
            Simon Says
          </Text>
        </View>
      </Pressable>

      <Pressable onPress={() => setActiveGame("game2")} className="mb-4">
        <View className="bg-blue-800 p-5 rounded-xl shadow-lg">
          <Text className="text-slate-100 text-lg font-semibold">
            Tenor Memes
          </Text>
        </View>
      </Pressable>

      <Pressable onPress={() => setActiveGame("game3")} className="mb-4">
        <View className="bg-blue-800 p-5 rounded-xl shadow-lg">
          <Text className="text-slate-100 text-lg font-semibold">
            Reddit Memes
          </Text>
        </View>
      </Pressable>

      <Modal visible={activeGame !== null} animationType="slide">
        <View className="flex-1 bg-slate-900 p-4">
          <Button title="Close" onPress={closeModal} color="#3b82f6" />
          {activeGame === "game1" && <Game1 />}
          {activeGame === "game2" && <Game2 />}
          {activeGame === "game3" && <Game3 />}
        </View>
      </Modal>
    </ScrollView>
  );
}
