import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";

const colors = ["red", "blue", "green", "yellow"];

export default function Game1() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [score, setScore] = useState(0);
  const [flashing, setFlashing] = useState<string | null>(null);

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    setSequence([]);
    setUserInput([]);
    setScore(0);
    setIsUserTurn(false);
    setTimeout(() => {
      addToSequence([]);
    }, 500);
  };

  const addToSequence = (prev: string[]) => {
    const next = [...prev, colors[Math.floor(Math.random() * colors.length)]];
    setSequence(next);
    showSequence(next);
  };

  const showSequence = async (seq: string[]) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise((res) => {
        setFlashing(seq[i]);
        setTimeout(() => {
          setFlashing(null);
          setTimeout(res, 200);
        }, 500);
      });
    }
    setUserInput([]);
    setIsUserTurn(true);
  };

  const handlePress = (color: string) => {
    if (!isUserTurn) return;

    const nextInput = [...userInput, color];
    setUserInput(nextInput);

    if (color !== sequence[nextInput.length - 1]) {
      Alert.alert("Game Over", `Score: ${score}`, [
        { text: "Try Again", onPress: startGame },
      ]);
      return;
    }

    if (nextInput.length === sequence.length) {
      setScore((s) => s + 1);
      setIsUserTurn(false);
      setTimeout(() => {
        addToSequence(sequence);
      }, 1000);
    }
  };

  const getButtonStyle = (color: string) => {
    const baseStyle = "w-32 h-32 m-2 rounded";
    const flash = flashing === color ? "bg-white" : "";

    switch (color) {
      case "red":
        return `${baseStyle} ${flash || "bg-red-500"}`;
      case "blue":
        return `${baseStyle} ${flash || "bg-blue-500"}`;
      case "green":
        return `${baseStyle} ${flash || "bg-green-500"}`;
      case "yellow":
        return `${baseStyle} ${flash || "bg-yellow-400"}`;
      default:
        return baseStyle;
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-3xl font-bold mb-4 text-white">Simon Says</Text>
      <Text className="text-lg mb-6 text-white">Score: {score}</Text>

      <View className="flex-row flex-wrap w-[280px] justify-center">
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            className={getButtonStyle(color)}
            onPress={() => handlePress(color)}
            activeOpacity={0.6}
          />
        ))}
      </View>
    </View>
  );
}
