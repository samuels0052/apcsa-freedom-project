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

export default function Chat() {
  const [input, setInput] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }
    fetchUserWithUID(auth.currentUser.uid).then((data) => {
      if (data) setUserData(data);
    });

    const q = query(
      collection(firestore, "chats"),
      orderBy("timestamp", "asc")
    );
    const renderMessages = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(chats);
    });

    return () => renderMessages();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    if (input.trim().length > 280) {
      alert("Messages must be under 280 characters!");
      return;
    }

    await addDoc(collection(firestore, "chats"), {
      text: input.trim(),
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
