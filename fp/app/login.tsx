import { useRef, useState } from "react";
import { View, TextInput, Button, Text, ActivityIndicator } from "react-native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, firestore } from "../firebase";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import * as Crypto from "expo-crypto";
import { fetchUserWithUsername } from "../utils/fetchUserData";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const usernameRef = useRef<TextInput>(null);
  const aboutRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleAuth = async () => {
    setLoading(true);

    if (!isLogin) {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        alert("Email must be in a valid format!");
        setLoading(false);
        return;
      }

      if (/[^a-zA-Z0-9]/.test(username)) {
        alert("Username can only contain letters or numbers!");
        setLoading(false);
        return;
      }

      const doesUsernameExist = await fetchUserWithUsername(username);
      if (doesUsernameExist) {
        alert("This username is taken!");
        setLoading(false);
        return;
      }

      if (/[^a-zA-Z0-9]/.test(firstName)) {
        alert("First Name can only contain letters or numbers!");
        setLoading(false);
        return;
      }

      if (/[^a-zA-Z0-9]/.test(lastName)) {
        alert("Last Name can only contain letters or numbers!");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters!");
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        const pfpSalt = Math.floor(Math.random() * 100000000);
        const seed = `${pfpSalt}${username}`.toLowerCase().trim();
        const hash = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          seed
        );
        const pfpHash = hash.substring(0, 12);
        const pfp = `https://api.dicebear.com/9.x/bottts-neutral/png?seed=${pfpHash}`;

        await setDoc(doc(firestore, "users", user.uid), {
          uid: user.uid,
          firstName,
          lastName,
          email,
          username,
          pfp,
          about,
          createdAt: new Date().toISOString(),
        });
      }

      router.replace("/home");
    } catch (err: any) {
      const error = err as FirebaseError;
      if (error.code === "auth/email-already-in-use") {
        alert("An account is already registered under this email!");
      } else if (error.code === "auth/invalid-credential") {
        alert("Incorrect password or account does not exist!");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-6 bg-slate-900">
      <Text className="text-3xl font-bold text-blue-400 mb-6">
        {isLogin ? "Login" : "Register"}
      </Text>

      {!isLogin && (
        <>
          <TextInput
            ref={firstNameRef}
            placeholder="John"
            placeholderTextColor="#94a3b8"
            value={firstName}
            onChangeText={setFirstName}
            className="bg-slate-800 border border-slate-700 text-slate-100 w-full mb-4 p-2 rounded"
          />
          <TextInput
            ref={lastNameRef}
            placeholder="Doe"
            placeholderTextColor="#94a3b8"
            value={lastName}
            onChangeText={setLastName}
            className="bg-slate-800 border border-slate-700 text-slate-100 w-full mb-4 p-2 rounded"
          />
          <TextInput
            ref={usernameRef}
            placeholder="jdoe123"
            placeholderTextColor="#94a3b8"
            value={username}
            onChangeText={setUsername}
            className="bg-slate-800 border border-slate-700 text-slate-100 w-full mb-4 p-2 rounded"
          />
          <TextInput
            ref={aboutRef}
            placeholder="Tell us about yourself..."
            placeholderTextColor="#94a3b8"
            value={about}
            onChangeText={setAbout}
            className="bg-slate-800 border border-slate-700 text-slate-100 w-full mb-4 p-2 rounded"
          />
        </>
      )}

      <TextInput
        ref={emailRef}
        placeholder="email@example.com"
        placeholderTextColor="#94a3b8"
        value={email}
        onChangeText={setEmail}
        className="bg-slate-800 border border-slate-700 text-slate-100 w-full mb-4 p-2 rounded"
      />

      <TextInput
        ref={passwordRef}
        placeholder="Password"
        placeholderTextColor="#94a3b8"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="bg-slate-800 border border-slate-700 text-slate-100 w-full mb-4 p-2 rounded"
      />

      {loading ? (
        <ActivityIndicator size="small" className="mt-4" color="#60a5fa" />
      ) : (
        <>
          <Button
            title={isLogin ? "Login" : "Register"}
            onPress={handleAuth}
            color="#3b82f6"
          />
          <Text
            className="mt-4 text-blue-400 underline"
            onPress={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "New here? Register" : "Already have an account? Login"}
          </Text>
        </>
      )}
    </View>
  );
}
