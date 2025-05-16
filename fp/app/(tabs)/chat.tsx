import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Image,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { firestore, auth } from "@/firebase";
import { fetchUserWithUID, fetchUserWithUsername } from "@/utils/fetchUserData";
import { useEffect, useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [privateThreads, setPrivateThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [searchUsername, setSearchUsername] = useState("");

  const getThreadId = (u1: string, u2: string) => [u1, u2].sort().join("_");

  useEffect(() => {
    if (!auth.currentUser) return;
    fetchUserWithUID(auth.currentUser.uid).then((data) => {
      if (data) setUserData(data);
    });
  }, []);

  useEffect(() => {
    if (!userData || !isPrivate) return;
    const ref = collection(firestore, "privateChats");
    const q = query(
      ref,
      where("participants", "array-contains", userData.username)
    );
    const unsub = onSnapshot(q, (snap) => {
      const threads = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPrivateThreads(threads);
    });
    return () => unsub();
  }, [isPrivate, userData]);

  useEffect(() => {
    if (!userData) return;

    let chatPath = "chats";
    if (isPrivate && selectedThread) {
      chatPath = `privateChats/${selectedThread}/messages`;
    }

    const q = query(
      collection(firestore, chatPath),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const newMsgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(newMsgs);
    });

    return () => unsub();
  }, [isPrivate, selectedThread, userData]);

  const startPrivateThread = async () => {
    const uname = searchUsername.trim();
    if (!uname) return;
    if (uname === userData.username) {
      Alert.alert("You can't message yourself.");
      return;
    }

    const otherUser = await fetchUserWithUsername(uname);
    if (!otherUser) {
      Alert.alert("User not found");
      return;
    }

    const threadId = getThreadId(userData.username, uname);
    const ref = doc(firestore, "privateChats", threadId);

    await setDoc(ref, {
      participants: [userData.username, uname],
      lastUpdated: Timestamp.now(),
    });

    setSelectedThread(threadId);
    setSearchUsername("");
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (trimmed.length > 280) {
      Alert.alert("Too long", "Max 280 characters.");
      return;
    }

    if (isPrivate && selectedThread) {
      await addDoc(
        collection(firestore, `privateChats/${selectedThread}/messages`),
        {
          text: trimmed,
          timestamp: Timestamp.now(),
          author: userData.username,
          pfp: userData.pfp,
        }
      );
    } else {
      await addDoc(collection(firestore, "chats"), {
        text: trimmed,
        timestamp: Timestamp.now(),
        author: userData.username,
        pfp: userData.pfp,
      });
    }

    setInput("");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 px-4 py-2 bg-slate-900"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View className="flex-row justify-between items-center mb-3">
        <TouchableOpacity
          onPress={() => {
            setIsPrivate(false);
            setSelectedThread(null);
          }}
        >
          <Text
            className={`font-bold ${
              !isPrivate ? "text-blue-400" : "text-gray-400"
            }`}
          >
            Global
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsPrivate(true);
          }}
        >
          <Text
            className={`font-bold ${
              isPrivate ? "text-blue-400" : "text-gray-400"
            }`}
          >
            Private
          </Text>
        </TouchableOpacity>
      </View>

      {isPrivate && !selectedThread && (
        <>
          <Text className="text-slate-300 mb-2">Private Threads</Text>
          <FlatList
            data={privateThreads}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const other = item.participants.find(
                (p: string) => p !== userData.username
              );
              return (
                <TouchableOpacity onPress={() => setSelectedThread(item.id)}>
                  <Text className="text-white p-2 border-b border-slate-700">
                    {other}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          <TextInput
            className="border bg-white text-black rounded p-2 mt-3"
            placeholder="Start new chat by username"
            value={searchUsername}
            onChangeText={setSearchUsername}
            onSubmitEditing={startPrivateThread}
          />
        </>
      )}

      {(selectedThread || !isPrivate) && (
        <>
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
                  <Text className="font-bold text-sm text-blue-200">
                    {item.author}
                  </Text>
                  <Text className="text-base text-slate-100">{item.text}</Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-slate-300 text-center mt-10">
                No messages yet...
              </Text>
            }
          />
          <View className="flex-row items-center pt-2 mb-3 gap-2">
            <TextInput
              className="flex-1 border rounded-lg p-3 bg-white text-black"
              placeholder="Type a message..."
              value={input}
              onChangeText={setInput}
            />
            <Button title="Send" onPress={handleSend} />
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}
