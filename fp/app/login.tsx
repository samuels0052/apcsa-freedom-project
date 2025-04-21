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
    <View className="flex-1 items-center justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-6">
        {isLogin ? "Login" : "Register"}
      </Text>

      {!isLogin && (
        <>
          <TextInput
            ref={firstNameRef}
            placeholder="John"
            value={firstName}
            onChangeText={setFirstName}
            maxLength={50}
            className="border w-full mb-4 p-2 rounded"
            keyboardType="default"
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current?.focus()}
          />
          <TextInput
            ref={lastNameRef}
            placeholder="Doe"
            value={lastName}
            onChangeText={setLastName}
            maxLength={50}
            className="border w-full mb-4 p-2 rounded"
            keyboardType="default"
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => usernameRef.current?.focus()}
          />
          <TextInput
            ref={usernameRef}
            placeholder="jdoe123"
            value={username}
            onChangeText={setUsername}
            maxLength={50}
            className="border w-full mb-4 p-2 rounded"
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => aboutRef.current?.focus()}
          />
          <TextInput
            ref={aboutRef}
            placeholder="Hi my name is John. I like fishing."
            value={about}
            onChangeText={setAbout}
            maxLength={50}
            className="border w-full mb-4 p-2 rounded"
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
        </>
      )}

      <TextInput
        ref={emailRef}
        placeholder="jdoe@gmail.com"
        value={email}
        onChangeText={setEmail}
        maxLength={100}
        className="border w-full mb-4 p-2 rounded"
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />

      <TextInput
        ref={passwordRef}
        placeholder="******"
        value={password}
        onChangeText={setPassword}
        maxLength={100}
        className="border w-full mb-4 p-2 rounded"
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={handleAuth}
      />

      {loading ? (
        <ActivityIndicator size="small" className="mt-4" />
      ) : (
        <>
          <Button title={isLogin ? "Login" : "Register"} onPress={handleAuth} />
          <Text
            className="mt-4 text-red-600"
            onPress={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "New here? Register" : "Already have an account? Login"}
          </Text>
        </>
      )}
    </View>
  );
}
