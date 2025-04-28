import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { firestore, auth } from "@/firebase";
import { fetchUserWithUID } from "@/utils/fetchUserData";
import { useEffect, useState } from "react";
import Aes from "react-native-aes-crypto";

const generateKey = (
  password: string,
  salt: string,
  cost: number,
  length: number
): Promise<string> => {
  return Aes.pbkdf2(password, salt, cost, length, "sha256");
};

export default function Chat() {
  const [input, setInput] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    fetchUserWithUID(auth.currentUser.uid).then((data) => {
      if (data) setUserData(data);
    });

    const password = "Ewp@^WMpb13WVrTqzZfeG@qbu$$B623F";
    const salt = "staticSalt";

    const q = query(
      collection(firestore, "chats"),
      orderBy("timestamp", "asc")
    );

    const renderMessages = onSnapshot(q, async (snapshot) => {
      const key = await generateKey(password, salt, 5000, 256);

      const decryptedMessages = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          let decryptedText = "[Error decrypting]";

          try {
            decryptedText = await Aes.decrypt(
              data.text,
              key,
              data.iv,
              "aes-256-cbc"
            );
          } catch (error) {
            console.error("Decryption failed:", error);
          }

          return {
            id: doc.id,
            ...data,
            text: decryptedText,
          };
        })
      );

      setMessages(decryptedMessages);
    });

    return () => renderMessages();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (input.trim().length > 280) {
      alert("Messages must be under 280 characters!");
      return;
    }

    const password = "Ewp@^WMpb13WVrTqzZfeG@qbu$$B623F";
    const salt = "staticSalt";
    const key = await generateKey(password, salt, 5000, 256);
    const iv = await Aes.randomKey(16);
    const cipher = await Aes.encrypt(input.trim(), key, iv, "aes-256-cbc");

    await addDoc(collection(firestore, "chats"), {
      text: cipher,
      iv: iv,
      timestamp: Timestamp.now(),
      author: userData?.username,
      pfp: userData?.pfp,
    });

    setInput("");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-between px-4 py-2 bg-white"
      behavior="padding"
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-3 flex-row items-start">
            {item.pfp ? (
              <Image
                source={{ uri: item.pfp }}
                className="w-6 h-6 rounded-full m-1"
              />
            ) : (
              <View className="w-6 h-6 rounded-full bg-gray-300 mt-1" />
            )}
            <View className="flex-1">
              <Text className="font-bold text-sm">{item.author}</Text>
              <Text className="text-base">{item.text}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No messages yet...</Text>}
      />
      <View className="flex-row items-center pt-2 mb-3 gap-2">
        <TextInput value={input.trim().length + ""}></TextInput>
        <TextInput
          className="flex-1 border rounded-lg p-3"
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
}
